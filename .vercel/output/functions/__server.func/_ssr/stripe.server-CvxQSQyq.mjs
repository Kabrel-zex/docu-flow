import { i as XAF_PER_EUR, l as eurCentsFromXaf } from "./engine-Csc4DLfU.mjs";
import { o as getRequest } from "./ssr.mjs";
import { r as getSql } from "./db-DREagAj3.mjs";
import { t as Stripe } from "../_libs/stripe.mjs";
import { randomUUID } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/stripe.server-CvxQSQyq.js
var PRICE_ENV = {
	starter: "STRIPE_PRICE_STARTER",
	business: "STRIPE_PRICE_BUSINESS",
	professional: "STRIPE_PRICE_PROFESSIONAL",
	enterprise: "STRIPE_PRICE_ENTERPRISE"
};
var stripeClient = null;
var productIdPromise = null;
function stripeReady() {
	return (process.env.STRIPE_SECRET_KEY?.trim() ?? "").startsWith("sk_");
}
function catalogPriceConfigured(code) {
	const key = PRICE_ENV[code];
	return Boolean(key && process.env[key]?.trim());
}
function getStripe() {
	const key = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
	if (!key.startsWith("sk_")) throw new Error("Stripe n'est pas configuré. Aucun paiement n'est simulé.");
	stripeClient ??= new Stripe(key);
	return stripeClient;
}
function appOrigin() {
	const req = getRequest();
	const origin = req.headers.get("origin");
	if (origin) try {
		const url = new URL(origin);
		if (url.protocol === "https:" || url.protocol === "http:") return url.origin;
	} catch {}
	const url = new URL(req.url);
	return `${(req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "")).split(",")[0]?.trim() || "https"}://${(req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? url.host).split(",")[0]?.trim() || url.host}`;
}
function assertStripeUrl(url) {
	const parsed = new URL(url);
	if (!(parsed.protocol === "https:" && (parsed.hostname === "checkout.stripe.com" || parsed.hostname === "billing.stripe.com"))) throw new Error("Stripe a renvoyé une adresse inattendue.");
	return url;
}
function isMissing(error) {
	return Boolean(error && typeof error === "object" && "code" in error && error.code === "resource_missing");
}
function today() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function periodEndOf(sub) {
	const end = sub.items.data[0]?.current_period_end;
	if (!end) return today();
	return (/* @__PURE__ */ new Date(end * 1e3)).toISOString().slice(0, 10);
}
function localStatus(sub) {
	if (sub.status === "active" || sub.status === "trialing") return sub.cancel_at_period_end ? "canceling" : "active";
	if (sub.status === "past_due" || sub.status === "unpaid" || sub.status === "paused") return "suspended";
	if (sub.status === "canceled" || sub.status === "incomplete_expired") return "cancelled";
	return "suspended";
}
async function audit(sql, orgId, userId, action, detail) {
	await sql`insert into audit_logs (id, organization_id, user_id, action, entity_type, entity_id, detail)
    values (${randomUUID()}, ${orgId}, ${userId}, ${action}, 'subscription', ${orgId}, ${detail.slice(0, 500)})`;
}
async function docuflowProduct(stripe) {
	const fromEnv = process.env.STRIPE_PRODUCT_ID?.trim();
	if (fromEnv) return fromEnv;
	productIdPromise ??= (async () => {
		const found = (await stripe.products.list({
			active: true,
			limit: 100
		})).data.find((product) => product.metadata?.app === "docuflow");
		if (found) return found.id;
		return (await stripe.products.create({
			name: "DOCUFLOW AI",
			metadata: { app: "docuflow" }
		})).id;
	})().catch((error) => {
		productIdPromise = null;
		throw error;
	});
	return productIdPromise;
}
async function resolvePrice(stripe, planCode, amountXaf, discountPercent, promoCode) {
	const envKey = PRICE_ENV[planCode];
	const catalog = envKey ? process.env[envKey]?.trim() : "";
	if (catalog) {
		if (discountPercent <= 0) return { priceId: catalog };
		return {
			priceId: catalog,
			couponId: (await stripe.coupons.create({
				percent_off: Math.min(100, discountPercent),
				duration: "forever",
				name: promoCode ? `DOCUFLOW ${promoCode}`.slice(0, 40) : `Remise ${discountPercent} %`
			})).id
		};
	}
	const cents = eurCentsFromXaf(amountXaf);
	if (cents < 50) throw new Error("Montant trop faible pour un encaissement Stripe.");
	return { priceId: (await stripe.prices.create({
		product: await docuflowProduct(stripe),
		currency: "eur",
		unit_amount: cents,
		recurring: { interval: "month" },
		metadata: {
			planCode,
			amountXaf: String(amountXaf)
		}
	})).id };
}
async function resolveOrg(sql, sub, fallbackOrgId = "") {
	const metaOrg = sub.metadata?.organizationId || fallbackOrgId;
	if (metaOrg) {
		const rows = await sql`select organization_id, plan_code, status from subscriptions where organization_id = ${metaOrg}`;
		if (rows[0]) return rows[0];
	}
	return (await sql`select organization_id, plan_code, status from subscriptions where stripe_subscription_id = ${sub.id}`)[0] ?? null;
}
async function applySubscription(sub, userId, fallbackOrgId = "") {
	const sql = await getSql();
	const link = await resolveOrg(sql, sub, fallbackOrgId);
	if (!link) return;
	const planCode = sub.metadata?.planCode || link.plan_code;
	if (!(await sql`select code from plans where code = ${planCode}`)[0]) throw new Error("Offre inconnue dans l'abonnement Stripe.");
	const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
	const status = localStatus(sub);
	const periodEnd = periodEndOf(sub);
	await sql`update subscriptions
    set plan_code = ${planCode}, status = ${status}, period_end = ${periodEnd},
      stripe_customer_id = ${customerId}, stripe_subscription_id = ${sub.id}
    where organization_id = ${link.organization_id}`;
	if (link.plan_code !== planCode || link.status !== status) await audit(sql, link.organization_id, userId, "billing.stripe", `${status} · ${planCode} · jusqu'au ${periodEnd}`);
}
async function recordStripeInvoice(invoice, userId) {
	const sql = await getSql();
	const parent = invoice.parent?.subscription_details;
	const subscriptionRef = parent?.subscription;
	const subscriptionId = !subscriptionRef ? "" : typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef.id;
	if (!subscriptionId) return;
	const link = (await sql`select organization_id, plan_code, status from subscriptions where stripe_subscription_id = ${subscriptionId}`)[0];
	if (!link) return;
	if ((await sql`select id from billing_invoices where stripe_invoice_id = ${invoice.id}`)[0]) return;
	const metaAmount = Number(parent?.metadata?.amountXaf ?? "");
	const cents = invoice.amount_paid ?? 0;
	const amountXaf = Number.isFinite(metaAmount) && metaAmount > 0 ? Math.round(metaAmount) : Math.round(cents / 100 * XAF_PER_EUR);
	const number = (invoice.number || `ST-${invoice.id}`).slice(0, 40);
	await sql`insert into billing_invoices
    (id, organization_id, number, plan_code, amount_xaf, status, issued_on, note, stripe_invoice_id, amount_eur_cents)
    values (${randomUUID()}, ${link.organization_id}, ${number}, ${link.plan_code}, ${amountXaf}, 'paid', ${today()},
      ${"Encaissé par Stripe."}, ${invoice.id}, ${cents})`;
	await audit(sql, link.organization_id, userId, "billing.paid", number);
}
async function syncPaidSession(session) {
	const stripe = getStripe();
	const ref = session.subscription;
	if (!ref) throw new Error("Session sans abonnement.");
	const sub = typeof ref === "string" ? await stripe.subscriptions.retrieve(ref) : ref;
	if (!sub.metadata?.organizationId && session.metadata?.organizationId) sub.metadata = {
		...session.metadata,
		...sub.metadata
	};
	await applySubscription(sub, "stripe", session.metadata?.organizationId || session.client_reference_id || "");
}
async function ensureCustomer(stripe, input) {
	if (input.customerId) try {
		const existing = await stripe.customers.retrieve(input.customerId);
		if (!("deleted" in existing && existing.deleted)) return existing.id;
	} catch (error) {
		if (!isMissing(error)) throw error;
	}
	return (await stripe.customers.create({
		email: input.email || void 0,
		name: input.orgName || void 0,
		metadata: { organizationId: input.orgId }
	})).id;
}
async function checkoutPlan(input) {
	const stripe = getStripe();
	const customerId = await ensureCustomer(stripe, input);
	const sql = await getSql();
	await sql`update subscriptions set stripe_customer_id = ${customerId} where organization_id = ${input.orgId}`;
	const samePlan = Boolean(input.subscriptionId) && input.localPlan === input.planCode;
	if (samePlan && input.localStatus === "active") throw new Error("Cette offre est déjà active. Le portail Stripe sert à changer le moyen de paiement.");
	if (input.subscriptionId) try {
		const current = await stripe.subscriptions.retrieve(input.subscriptionId);
		if (current.status !== "canceled" && current.status !== "incomplete_expired") {
			const item = current.items.data[0];
			if (!item) throw new Error("Abonnement Stripe incomplet.");
			const price = samePlan ? null : await resolvePrice(stripe, input.planCode, input.amountXaf, input.discountPercent, input.promoCode);
			await applySubscription(await stripe.subscriptions.update(current.id, {
				cancel_at_period_end: false,
				proration_behavior: "create_prorations",
				metadata: {
					organizationId: input.orgId,
					planCode: input.planCode,
					amountXaf: String(input.amountXaf)
				},
				...price ? {
					items: [{
						id: item.id,
						price: price.priceId
					}],
					discounts: price.couponId ? [{ coupon: price.couponId }] : ""
				} : {}
			}), input.userId, input.orgId);
			return {
				ok: true,
				url: null,
				updated: true
			};
		}
	} catch (error) {
		if (!isMissing(error)) throw error;
	}
	const price = await resolvePrice(stripe, input.planCode, input.amountXaf, input.discountPercent, input.promoCode);
	const origin = appOrigin();
	const session = await stripe.checkout.sessions.create({
		mode: "subscription",
		customer: customerId,
		client_reference_id: input.orgId,
		success_url: `${origin}/app/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${origin}/app/billing?checkout=cancel`,
		line_items: [{
			price: price.priceId,
			quantity: 1
		}],
		...price.couponId ? { discounts: [{ coupon: price.couponId }] } : {},
		metadata: {
			organizationId: input.orgId,
			planCode: input.planCode,
			amountXaf: String(input.amountXaf)
		},
		subscription_data: {
			metadata: {
				organizationId: input.orgId,
				planCode: input.planCode,
				amountXaf: String(input.amountXaf)
			},
			description: `${input.planName} — ${input.amountXaf} FCFA / mois, parité 1 EUR = 655,957 FCFA`
		}
	});
	if (!session.url) throw new Error("Stripe n'a pas ouvert de page de paiement.");
	await audit(sql, input.orgId, input.userId, "billing.checkout", input.planCode);
	return {
		ok: true,
		url: assertStripeUrl(session.url),
		updated: false
	};
}
async function openBillingPortal(customerId) {
	if (!customerId) throw new Error("Aucun paiement Stripe n'est encore associé à cette organisation.");
	return {
		ok: true,
		url: assertStripeUrl((await getStripe().billingPortal.sessions.create({
			customer: customerId,
			return_url: `${appOrigin()}/app/billing`
		})).url),
		updated: false
	};
}
async function cancelStripeSubscription(input) {
	const sql = await getSql();
	if (!input.subscriptionId) {
		await sql`update subscriptions set status = 'cancelled' where organization_id = ${input.orgId}`;
		await audit(sql, input.orgId, input.userId, "billing.cancel", "Essai interrompu. Documents conservés.");
		return {
			ok: true,
			url: null,
			updated: true
		};
	}
	const stripe = getStripe();
	try {
		await applySubscription(await stripe.subscriptions.update(input.subscriptionId, { cancel_at_period_end: true }), input.userId, input.orgId);
	} catch (error) {
		if (!isMissing(error)) throw error;
		await sql`update subscriptions set status = 'cancelled' where organization_id = ${input.orgId}`;
		await audit(sql, input.orgId, input.userId, "billing.cancel", "Abonnement Stripe introuvable. Accès interrompu, documents conservés.");
	}
	return {
		ok: true,
		url: null,
		updated: true
	};
}
async function confirmCheckout(orgId, sessionId) {
	if (!/^cs_[A-Za-z0-9_]+$/.test(sessionId)) throw new Error("Session de paiement invalide.");
	const session = await getStripe().checkout.sessions.retrieve(sessionId);
	if ((session.metadata?.organizationId || session.client_reference_id || "") !== orgId) throw new Error("Cette session ne concerne pas votre organisation.");
	if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") throw new Error("Paiement non confirmé par Stripe.");
	await syncPaidSession(session);
	return {
		ok: true,
		url: null,
		updated: true
	};
}
async function handleStripeWebhook(raw, signature) {
	const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? "";
	if (!stripeReady() || !secret) {
		const error = /* @__PURE__ */ new Error("Webhook Stripe non configuré.");
		error.status = 503;
		throw error;
	}
	let event;
	try {
		event = getStripe().webhooks.constructEvent(raw, signature, secret);
	} catch {
		const error = /* @__PURE__ */ new Error("Signature Stripe invalide.");
		error.status = 400;
		throw error;
	}
	const sql = await getSql();
	if (!(await sql`insert into stripe_events (id, type) values (${event.id}, ${event.type}) on conflict (id) do nothing returning id`)[0]) return { received: true };
	try {
		await dispatchStripeEvent(event);
	} catch (error) {
		await sql`delete from stripe_events where id = ${event.id}`;
		throw error;
	}
	return { received: true };
}
async function dispatchStripeEvent(event) {
	if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
		const session = event.data.object;
		if (session.mode !== "subscription") return;
		if (session.payment_status !== "paid" && session.payment_status !== "no_payment_required") return;
		await syncPaidSession(session);
		return;
	}
	if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
		await applySubscription(event.data.object, "stripe");
		return;
	}
	if (event.type === "invoice.paid") {
		const invoice = event.data.object;
		const subscriptionRef = invoice.parent?.subscription_details?.subscription;
		if (subscriptionRef) {
			const id = typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef.id;
			await applySubscription(await getStripe().subscriptions.retrieve(id), "stripe");
		}
		await recordStripeInvoice(invoice, "stripe");
		return;
	}
	if (event.type === "invoice.payment_failed") {
		const subscriptionRef = event.data.object.parent?.subscription_details?.subscription;
		const id = !subscriptionRef ? "" : typeof subscriptionRef === "string" ? subscriptionRef : subscriptionRef.id;
		if (!id) return;
		await (await getSql())`update subscriptions set status = 'suspended' where stripe_subscription_id = ${id} and status in ('active', 'canceling')`;
	}
}
//#endregion
export { cancelStripeSubscription, catalogPriceConfigured, checkoutPlan, confirmCheckout, handleStripeWebhook, openBillingPortal, stripeReady };
