import { randomUUID } from "node:crypto";
import Stripe from "stripe";
import { getRequest } from "@tanstack/react-start/server";
import { getSql, type Sql } from "@/lib/db";
import { XAF_PER_EUR, eurCentsFromXaf } from "@/lib/docuflow/engine";

const PRICE_ENV: Record<string, string> = {
  starter: "STRIPE_PRICE_STARTER",
  business: "STRIPE_PRICE_BUSINESS",
  professional: "STRIPE_PRICE_PROFESSIONAL",
  enterprise: "STRIPE_PRICE_ENTERPRISE",
};

let stripeClient: Stripe | null = null;
let productIdPromise: Promise<string> | null = null;

export function stripeReady(): boolean {
  return (process.env.STRIPE_SECRET_KEY?.trim() ?? "").startsWith("sk_");
}

export function catalogPriceConfigured(code: string): boolean {
  const key = PRICE_ENV[code];
  return Boolean(key && process.env[key]?.trim());
}

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  if (!key.startsWith("sk_")) throw new Error("Stripe n'est pas configuré. Aucun paiement n'est simulé.");
  stripeClient ??= new Stripe(key);
  return stripeClient;
}

function appOrigin(): string {
  const req = getRequest();
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const url = new URL(origin);
      if (url.protocol === "https:" || url.protocol === "http:") return url.origin;
    } catch {
      /* en-tête illisible */
    }
  }
  const url = new URL(req.url);
  const proto = (req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")).split(",")[0]?.trim() || "https";
  const host = (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? url.host).split(",")[0]?.trim() || url.host;
  return `${proto}://${host}`;
}

function assertStripeUrl(url: string): string {
  const parsed = new URL(url);
  const allowed = parsed.protocol === "https:" && (parsed.hostname === "checkout.stripe.com" || parsed.hostname === "billing.stripe.com");
  if (!allowed) throw new Error("Stripe a renvoyé une adresse inattendue.");
  return url;
}

function isMissing(error: unknown): boolean {
  return Boolean(error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "resource_missing");
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function periodEndOf(sub: Stripe.Subscription): string {
  const end = sub.items.data[0]?.current_period_end;
  if (!end) return today();
  return new Date(end * 1000).toISOString().slice(0, 10);
}

function localStatus(sub: Stripe.Subscription): string {
  if (sub.status === "active" || sub.status === "trialing") return sub.cancel_at_period_end ? "canceling" : "active";
  if (sub.status === "past_due" || sub.status === "unpaid" || sub.status === "paused") return "suspended";
  if (sub.status === "canceled" || sub.status === "incomplete_expired") return "cancelled";
  return "suspended";
}

async function audit(sql: Sql, orgId: string, userId: string, action: string, detail: string) {
  await sql`insert into audit_logs (id, organization_id, user_id, action, entity_type, entity_id, detail)
    values (${randomUUID()}, ${orgId}, ${userId}, ${action}, 'subscription', ${orgId}, ${detail.slice(0, 500)})`;
}

async function docuflowProduct(stripe: Stripe): Promise<string> {
  const fromEnv = process.env.STRIPE_PRODUCT_ID?.trim();
  if (fromEnv) return fromEnv;
  productIdPromise ??= (async () => {
    const listed = await stripe.products.list({ active: true, limit: 100 });
    const found = listed.data.find((product) => product.metadata?.app === "docuflow");
    if (found) return found.id;
    const created = await stripe.products.create({ name: "DOCUFLOW AI", metadata: { app: "docuflow" } });
    return created.id;
  })().catch((error: unknown) => {
    productIdPromise = null;
    throw error;
  });
  return productIdPromise;
}

async function resolvePrice(
  stripe: Stripe,
  planCode: string,
  amountXaf: number,
  discountPercent: number,
  promoCode: string,
): Promise<{ priceId: string; couponId?: string }> {
  const envKey = PRICE_ENV[planCode];
  const catalog = envKey ? process.env[envKey]?.trim() : "";
  if (catalog) {
    if (discountPercent <= 0) return { priceId: catalog };
    const coupon = await stripe.coupons.create({
      percent_off: Math.min(100, discountPercent),
      duration: "forever",
      name: promoCode ? `DOCUFLOW ${promoCode}`.slice(0, 40) : `Remise ${discountPercent} %`,
    });
    return { priceId: catalog, couponId: coupon.id };
  }
  const cents = eurCentsFromXaf(amountXaf);
  if (cents < 50) throw new Error("Montant trop faible pour un encaissement Stripe.");
  const price = await stripe.prices.create({
    product: await docuflowProduct(stripe),
    currency: "eur",
    unit_amount: cents,
    recurring: { interval: "month" },
    metadata: { planCode, amountXaf: String(amountXaf) },
  });
  return { priceId: price.id };
}

type Link = { organization_id: string; plan_code: string; status: string };

async function resolveOrg(sql: Sql, sub: Stripe.Subscription, fallbackOrgId = ""): Promise<Link | null> {
  const metaOrg = sub.metadata?.organizationId || fallbackOrgId;
  if (metaOrg) {
    const rows = await sql<Link>`select organization_id, plan_code, status from subscriptions where organization_id = ${metaOrg}`;
    if (rows[0]) return rows[0];
  }
  const bySub = await sql<Link>`select organization_id, plan_code, status from subscriptions where stripe_subscription_id = ${sub.id}`;
  return bySub[0] ?? null;
}

async function applySubscription(sub: Stripe.Subscription, userId: string, fallbackOrgId = ""): Promise<void> {
  const sql = await getSql();
  const link = await resolveOrg(sql, sub, fallbackOrgId);
  if (!link) return;
  const planCode = sub.metadata?.planCode || link.plan_code;
  const known = await sql<{ code: string }>`select code from plans where code = ${planCode}`;
  if (!known[0]) throw new Error("Offre inconnue dans l'abonnement Stripe.");
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const status = localStatus(sub);
  const periodEnd = periodEndOf(sub);
  await sql`update subscriptions
    set plan_code = ${planCode}, status = ${status}, period_end = ${periodEnd},
      stripe_customer_id = ${customerId}, stripe_subscription_id = ${sub.id}
    where organization_id = ${link.organization_id}`;
  if (link.plan_code !== planCode || link.status !== status) {
    await audit(sql, link.organization_id, userId, "billing.stripe", `${status} · ${planCode} · jusqu'au ${periodEnd}`);
  }
}

async function recordStripeInvoice(invoice: Stripe.Invoice, userId: string) {
  const sql = await getSql();
  const parent = invoice.parent?.subscription_details;
  const subscriptionRef = parent?.subscription;
  const subscriptionId = !subscriptionRef ? "" : typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef.id;
  if (!subscriptionId) return;
  const rows = await sql<Link>`select organization_id, plan_code, status from subscriptions where stripe_subscription_id = ${subscriptionId}`;
  const link = rows[0];
  if (!link) return;
  const existing = await sql<{ id: string }>`select id from billing_invoices where stripe_invoice_id = ${invoice.id}`;
  if (existing[0]) return;
  const metaAmount = Number(parent?.metadata?.amountXaf ?? "");
  const cents = invoice.amount_paid ?? 0;
  const amountXaf = Number.isFinite(metaAmount) && metaAmount > 0 ? Math.round(metaAmount) : Math.round((cents / 100) * XAF_PER_EUR);
  const number = (invoice.number || `ST-${invoice.id}`).slice(0, 40);
  await sql`insert into billing_invoices
    (id, organization_id, number, plan_code, amount_xaf, status, issued_on, note, stripe_invoice_id, amount_eur_cents)
    values (${randomUUID()}, ${link.organization_id}, ${number}, ${link.plan_code}, ${amountXaf}, 'paid', ${today()},
      ${"Encaissé par Stripe."}, ${invoice.id}, ${cents})`;
  await audit(sql, link.organization_id, userId, "billing.paid", number);
}

async function syncPaidSession(session: Stripe.Checkout.Session) {
  const stripe = getStripe();
  const ref = session.subscription;
  if (!ref) throw new Error("Session sans abonnement.");
  const sub = typeof ref === "string" ? await stripe.subscriptions.retrieve(ref) : ref;
  if (!sub.metadata?.organizationId && session.metadata?.organizationId) {
    sub.metadata = { ...session.metadata, ...sub.metadata };
  }
  await applySubscription(sub, "stripe", session.metadata?.organizationId || session.client_reference_id || "");
}

export type CheckoutInput = {
  userId: string;
  orgId: string;
  email: string;
  orgName: string;
  planCode: string;
  planName: string;
  amountXaf: number;
  discountPercent: number;
  promoCode: string;
  customerId: string;
  subscriptionId: string;
  localStatus: string;
  localPlan: string;
};

async function ensureCustomer(stripe: Stripe, input: CheckoutInput): Promise<string> {
  if (input.customerId) {
    try {
      const existing = await stripe.customers.retrieve(input.customerId);
      if (!("deleted" in existing && existing.deleted)) return existing.id;
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
  }
  const created = await stripe.customers.create({
    email: input.email || undefined,
    name: input.orgName || undefined,
    metadata: { organizationId: input.orgId },
  });
  return created.id;
}

export async function checkoutPlan(input: CheckoutInput): Promise<{ ok: true; url: string | null; updated: boolean }> {
  const stripe = getStripe();
  const customerId = await ensureCustomer(stripe, input);
  const sql = await getSql();
  await sql`update subscriptions set stripe_customer_id = ${customerId} where organization_id = ${input.orgId}`;
  const samePlan = Boolean(input.subscriptionId) && input.localPlan === input.planCode;
  if (samePlan && input.localStatus === "active") {
    throw new Error("Cette offre est déjà active. Le portail Stripe sert à changer le moyen de paiement.");
  }
  if (input.subscriptionId) {
    try {
      const current = await stripe.subscriptions.retrieve(input.subscriptionId);
      if (current.status !== "canceled" && current.status !== "incomplete_expired") {
        const item = current.items.data[0];
        if (!item) throw new Error("Abonnement Stripe incomplet.");
        const price = samePlan ? null : await resolvePrice(stripe, input.planCode, input.amountXaf, input.discountPercent, input.promoCode);
        const updated = await stripe.subscriptions.update(current.id, {
          cancel_at_period_end: false,
          proration_behavior: "create_prorations",
          metadata: {
            organizationId: input.orgId,
            planCode: input.planCode,
            amountXaf: String(input.amountXaf),
          },
          ...(price
            ? {
                items: [{ id: item.id, price: price.priceId }],
                discounts: price.couponId ? [{ coupon: price.couponId }] : "",
              }
            : {}),
        });
        await applySubscription(updated, input.userId, input.orgId);
        return { ok: true, url: null, updated: true };
      }
    } catch (error) {
      if (!isMissing(error)) throw error;
    }
  }
  const price = await resolvePrice(stripe, input.planCode, input.amountXaf, input.discountPercent, input.promoCode);
  const origin = appOrigin();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: input.orgId,
    success_url: `${origin}/app/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/app/billing?checkout=cancel`,
    line_items: [{ price: price.priceId, quantity: 1 }],
    ...(price.couponId ? { discounts: [{ coupon: price.couponId }] } : {}),
    metadata: {
      organizationId: input.orgId,
      planCode: input.planCode,
      amountXaf: String(input.amountXaf),
    },
    subscription_data: {
      metadata: {
        organizationId: input.orgId,
        planCode: input.planCode,
        amountXaf: String(input.amountXaf),
      },
      description: `${input.planName} — ${input.amountXaf} FCFA / mois, parité 1 EUR = 655,957 FCFA`,
    },
  });
  if (!session.url) throw new Error("Stripe n'a pas ouvert de page de paiement.");
  await audit(sql, input.orgId, input.userId, "billing.checkout", input.planCode);
  return { ok: true, url: assertStripeUrl(session.url), updated: false };
}

export async function openBillingPortal(customerId: string): Promise<{ ok: true; url: string | null; updated: boolean }> {
  if (!customerId) throw new Error("Aucun paiement Stripe n'est encore associé à cette organisation.");
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appOrigin()}/app/billing`,
  });
  return { ok: true, url: assertStripeUrl(session.url), updated: false };
}

export async function cancelStripeSubscription(input: { userId: string; orgId: string; subscriptionId: string }): Promise<{ ok: true; url: string | null; updated: boolean }> {
  const sql = await getSql();
  if (!input.subscriptionId) {
    await sql`update subscriptions set status = 'cancelled' where organization_id = ${input.orgId}`;
    await audit(sql, input.orgId, input.userId, "billing.cancel", "Essai interrompu. Documents conservés.");
    return { ok: true, url: null, updated: true };
  }
  const stripe = getStripe();
  try {
    const updated = await stripe.subscriptions.update(input.subscriptionId, { cancel_at_period_end: true });
    await applySubscription(updated, input.userId, input.orgId);
  } catch (error) {
    if (!isMissing(error)) throw error;
    await sql`update subscriptions set status = 'cancelled' where organization_id = ${input.orgId}`;
    await audit(sql, input.orgId, input.userId, "billing.cancel", "Abonnement Stripe introuvable. Accès interrompu, documents conservés.");
  }
  return { ok: true, url: null, updated: true };
}

export async function confirmCheckout(orgId: string, sessionId: string): Promise<{ ok: true; url: string | null; updated: boolean }> {
  if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) throw new Error("Session de paiement invalide.");
  const session = await getStripe().checkout.sessions.retrieve(sessionId);
  const owner = session.metadata?.organizationId || session.client_reference_id || "";
  if (owner !== orgId) throw new Error("Cette session ne concerne pas votre organisation.");
  if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") {
    throw new Error("Paiement non confirmé par Stripe.");
  }
  await syncPaidSession(session);
  return { ok: true, url: null, updated: true };
}

export async function handleStripeWebhook(raw: string, signature: string): Promise<{ received: true }> {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? "";
  if (!stripeReady() || !secret) {
    const error = new Error("Webhook Stripe non configuré.");
    (error as Error & { status?: number }).status = 503;
    throw error;
  }
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, signature, secret);
  } catch {
    const error = new Error("Signature Stripe invalide.");
    (error as Error & { status?: number }).status = 400;
    throw error;
  }
  const sql = await getSql();
  const seen = await sql<{ id: string }>`insert into stripe_events (id, type) values (${event.id}, ${event.type}) on conflict (id) do nothing returning id`;
  if (!seen[0]) return { received: true };
  try {
    await dispatchStripeEvent(event);
  } catch (error) {
    await sql`delete from stripe_events where id = ${event.id}`;
    throw error;
  }
  return { received: true };
}

async function dispatchStripeEvent(event: Stripe.Event) {
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode !== "subscription") return;
    if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") return;
    await syncPaidSession(session);
    return;
  }
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    await applySubscription(event.data.object as Stripe.Subscription, "stripe");
    return;
  }
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionRef = invoice.parent?.subscription_details?.subscription;
    if (subscriptionRef) {
      const id = typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef.id;
      await applySubscription(await getStripe().subscriptions.retrieve(id), "stripe");
    }
    await recordStripeInvoice(invoice, "stripe");
    return;
  }
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionRef = invoice.parent?.subscription_details?.subscription;
    const id = !subscriptionRef ? "" : typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef.id;
    if (!id) return;
    const sql = await getSql();
    await sql`update subscriptions set status = 'suspended' where stripe_subscription_id = ${id} and status in ('active', 'canceling')`;
  }
}
