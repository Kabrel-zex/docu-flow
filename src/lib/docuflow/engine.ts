export const SYSTEM_CATEGORIES: { slug: string; name: string }[] = [
  { slug: "facture", name: "Factures" },
  { slug: "devis", name: "Devis" },
  { slug: "bon_commande", name: "Bons de commande" },
  { slug: "contrat", name: "Contrats" },
  { slug: "bulletin", name: "Bulletins de salaire" },
  { slug: "fiscal", name: "Documents fiscaux" },
  { slug: "bancaire", name: "Documents bancaires" },
  { slug: "administratif", name: "Documents administratifs" },
  { slug: "juridique", name: "Documents juridiques" },
  { slug: "scolaire", name: "Documents scolaires" },
  { slug: "commercial", name: "Documents commerciaux" },
  { slug: "rh", name: "Documents RH" },
  { slug: "immobilier", name: "Documents immobiliers" },
  { slug: "identite", name: "Documents d'identité" },
  { slug: "autre", name: "Autres documents" },
];

const PHRASES: { slug: string; items: [string, number][] }[] = [
  { slug: "bulletin", items: [["bulletin de salaire", 6], ["salaire net", 4], ["salaire brut", 3], ["payslip", 5]] },
  { slug: "identite", items: [["carte nationale", 6], ["passeport", 5], ["cni", 3], ["document d'identite", 5]] },
  { slug: "rh", items: [["contrat de travail", 6], ["ressources humaines", 4], ["embauche", 3], ["fiche de poste", 4]] },
  { slug: "immobilier", items: [["contrat de bail", 6], ["loyer mensuel", 4], ["bail commercial", 5], ["immobilier", 2]] },
  { slug: "facture", items: [["facture", 4], ["invoice", 4], ["montant ttc", 3], ["montant ht", 2], ["tva", 1]] },
  { slug: "devis", items: [["devis", 8], ["quotation", 6], ["proposition de prix", 6]] },
  { slug: "bon_commande", items: [["bon de commande", 6], ["purchase order", 5]] },
  { slug: "fiscal", items: [["declaration fiscale", 6], ["impot", 3], ["direction generale des impots", 5], ["dgi", 2], ["nif", 1]] },
  { slug: "bancaire", items: [["releve bancaire", 6], ["rib", 3], ["virement", 2], ["bank statement", 5]] },
  { slug: "juridique", items: [["tribunal", 4], ["assignation", 5], ["statuts de la societe", 4], ["mise en demeure", 4]] },
  { slug: "scolaire", items: [["releve de notes", 6], ["diplome", 4], ["universite", 2], ["bulletin scolaire", 5]] },
  { slug: "commercial", items: [["bon de livraison", 5], ["conditions commerciales", 3]] },
  { slug: "administratif", items: [["attestation", 3], ["prefecture", 4], ["mairie", 3], ["administration", 2]] },
  { slug: "contrat", items: [["contrat", 3], ["entre les soussignes", 5], ["duree du contrat", 3], ["resiliation", 2]] },
];

export type Field = {
  fieldKey: string;
  label: string;
  value: string;
  dataType: "text" | "date" | "money" | "number";
  confidence: number;
  pageNo: number | null;
};

export type ParsedDoc = {
  categorySlug: string;
  categoryName: string;
  confidence: number;
  fields: Field[];
  supplier: string;
  clientName: string;
  docNumber: string;
  issueDate: string | null;
  dueDate: string | null;
  amountHt: number | null;
  taxAmount: number | null;
  amountTtc: number | null;
  currency: string;
  summary: string;
  status: "done" | "review";
  parties: string[];
  title: string;
};

export type Intent =
  | { type: "count"; category?: string; from?: string; to?: string; supplier?: string; minAmount?: number }
  | { type: "sum"; category?: string; from?: string; to?: string; supplier?: string; minAmount?: number }
  | { type: "expiring"; from: string; to: string; category?: string }
  | { type: "list"; category?: string; from?: string; to?: string; supplier?: string; minAmount?: number; text?: string }
  | { type: "none" };

function fold(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");
}

export function categoryName(slug: string): string {
  return SYSTEM_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function formatMoney(n: number | null | undefined, currency = "XAF"): string {
  if (n == null || Number.isNaN(n)) return "—";
  const unit = currency === "XAF" || currency === "FCFA" ? "FCFA" : currency;
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n))} ${unit}`;
}

/** Parité fixe du franc CFA (CEMAC / UEMOA). Stripe n'encaisse pas le FCFA. */
export const XAF_PER_EUR = 655.957;

export function eurCentsFromXaf(amountXaf: number): number {
  return Math.round((Math.max(0, amountXaf) / XAF_PER_EUR) * 100);
}

export function formatEurFromCents(cents: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function parseAmount(raw: string): number | null {
  let s = raw.replace(/[\s\u00a0]/g, "");
  if (s.includes(",") && s.includes(".")) {
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
  } else if (s.includes(",")) {
    const parts = s.split(",");
    if (parts[1] && parts[1].length <= 2) s = `${parts[0]}.${parts[1]}`;
    else s = s.replace(/,/g, "");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, "");
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function normDate(input: string): string | null {
  const iso = input.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const m = input.match(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/);
  if (!m) return null;
  let y = Number(m[3]);
  if (y < 100) y += 2000;
  const a = Number(m[1]);
  const b = Number(m[2]);
  const day = a > 12 ? a : a;
  const month = a > 12 ? b : b;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${y}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function lineValue(text: string, labels: string[]): string {
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const f = fold(line);
    for (const label of labels) {
      const idx = f.indexOf(fold(label));
      if (idx === -1) continue;
      const raw = line.slice(idx + label.length).replace(/^[\s:.\-–]+/, "").trim();
      if (raw) return raw.slice(0, 180);
    }
  }
  return "";
}

function findAmount(text: string, labels: string[]): number | null {
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const f = fold(line);
    if (!labels.some((l) => f.includes(fold(l)))) continue;
    const m = line.match(/(\d[\d\s\u00a0.,]{1,18})/);
    if (m) {
      const n = parseAmount(m[1]);
      if (n != null) return n;
    }
  }
  return null;
}

function findDate(text: string, labels: string[]): string | null {
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const f = fold(line);
    if (!labels.some((l) => f.includes(fold(l)))) continue;
    const d = normDate(line);
    if (d) return d;
  }
  return null;
}

function detectCurrency(text: string): string {
  const f = fold(text);
  if (f.includes("fcfa") || f.includes("xaf") || f.includes("cfa")) return "XAF";
  if (f.includes("eur") || text.includes("€")) return "EUR";
  if (f.includes("usd") || text.includes("$")) return "USD";
  return "XAF";
}

export function analyzeText(fileName: string, text: string): ParsedDoc {
  const blob = fold(`${fileName}\n${text}`);
  let best = "autre";
  let score = 0;
  for (const group of PHRASES) {
    let s = 0;
    for (const [phrase, w] of group.items) {
      if (blob.includes(fold(phrase))) s += w;
    }
    if (s > score) {
      score = s;
      best = group.slug;
    }
  }
  const confidence = score === 0 ? 0.34 : Math.min(0.96, 0.42 + score * 0.08);
  const currency = detectCurrency(text);
  const supplier = lineValue(text, ["Fournisseur", "Emetteur", "Employeur", "Bailleur", "Société émettrice"]);
  const clientName = lineValue(text, ["Client", "Destinataire", "Employé", "Employe", "Locataire", "Titulaire"]);
  const docNumber =
    lineValue(text, ["N°", "No facture", "Numero", "Numéro", "Référence", "Reference", "Invoice"]) ||
    (text.match(/\b(?:FAC|DEV|BC|CTR|BL)[-/][A-Z0-9-]{3,}\b/i)?.[0] ?? "");
  const issueDate = findDate(text, ["émission", "emission", "date de délivrance", "date :", "délivré", "periode", "période"]);
  const dueDate = findDate(text, ["échéance", "echeance", "expiration", "date de fin", "fin du contrat", "jusqu'au", "jusqu’au"]);
  const amountHt = findAmount(text, ["montant ht", "total ht", "salaire brut", "ht :"]);
  const taxAmount = findAmount(text, ["tva", "taxe", "retenues"]);
  const amountTtc = findAmount(text, ["montant ttc", "total ttc", "net a payer", "net à payer", "salaire net", "ttc"]);
  const parties = [supplier, clientName].filter(Boolean);
  const fields: Field[] = [];
  const push = (fieldKey: string, label: string, value: string, dataType: Field["dataType"], conf: number) => {
    if (!value) return;
    fields.push({ fieldKey, label, value, dataType, confidence: conf, pageNo: 1 });
  };
  push("supplier", "Fournisseur / émetteur", supplier, "text", supplier ? 0.86 : 0);
  push("client", "Client / titulaire", clientName, "text", clientName ? 0.8 : 0);
  push("number", "Numéro", docNumber, "text", docNumber ? 0.84 : 0);
  push("issue_date", "Date", issueDate ?? "", "date", issueDate ? 0.82 : 0);
  push("due_date", "Échéance", dueDate ?? "", "date", dueDate ? 0.8 : 0);
  if (amountHt != null) push("amount_ht", "Montant HT", String(amountHt), "money", 0.78);
  if (taxAmount != null) push("tax", "Taxes", String(taxAmount), "money", 0.74);
  if (amountTtc != null) push("amount_ttc", "Montant TTC", String(amountTtc), "money", 0.8);
  push("currency", "Devise", currency, "text", 0.9);
  const name = categoryName(best);
  const base = fileName.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
  const title = docNumber && best === "facture" ? `Facture ${docNumber}` : base || name;
  const bits = [
    `Classé « ${name} » (confiance ${Math.round(confidence * 100)} %).`,
    supplier ? `Émetteur : ${supplier}.` : "",
    docNumber ? `N° ${docNumber}.` : "",
    amountTtc != null ? `Montant ${formatMoney(amountTtc, currency)}.` : "",
    dueDate ? `Échéance ${dueDate}.` : "",
  ].filter(Boolean);
  const criticalMissing =
    (best === "facture" && (amountTtc == null || !docNumber)) ||
    (best === "contrat" && !dueDate) ||
    confidence < 0.55;
  return {
    categorySlug: best,
    categoryName: name,
    confidence,
    fields,
    supplier,
    clientName,
    docNumber,
    issueDate,
    dueDate,
    amountHt,
    taxAmount,
    amountTtc,
    currency,
    summary: bits.join(" "),
    status: criticalMissing ? "review" : "done",
    parties,
    title: title.slice(0, 160),
  };
}

const MONTHS: Record<string, number> = {
  janvier: 1, fevrier: 2, mars: 3, avril: 4, mai: 5, juin: 6,
  juillet: 7, aout: 8, septembre: 9, octobre: 10, novembre: 11, decembre: 12,
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function monthBounds(year: number, month: number): { from: string; to: string } {
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return { from: `${year}-${pad(month)}-01`, to: `${year}-${pad(month)}-${pad(last)}` };
}

function quarterBounds(d: Date): { from: string; to: string } {
  const q = Math.floor(d.getUTCMonth() / 3);
  const start = q * 3;
  return { from: `${d.getUTCFullYear()}-${pad(start + 1)}-01`, to: monthBounds(d.getUTCFullYear(), start + 3).to };
}

const CAT_WORDS: [string, string][] = [
  ["facture", "facture"], ["invoice", "facture"], ["devis", "devis"], ["contrat", "contrat"],
  ["bulletin", "bulletin"], ["salaire", "bulletin"], ["fiscal", "fiscal"], ["impot", "fiscal"],
  ["bancaire", "bancaire"], ["bail", "immobilier"], ["identite", "identite"], ["commande", "bon_commande"],
];

export function parseIntent(question: string, now = new Date()): Intent {
  const s = fold(question);
  let category: string | undefined;
  for (const [word, slug] of CAT_WORDS) {
    if (s.includes(word)) {
      category = slug;
      break;
    }
  }
  let supplier: string | undefined;
  const after = question.split(/fournisseur\s+/i)[1];
  if (after) {
    const kept: string[] = [];
    for (const word of after.split(/\s+/)) {
      const token = word.replace(/[.,;:!?»«]+$/g, "");
      const folded = fold(token);
      if (!token || /^(superieure|superieures|plus|de|du|des|ce|cette|en|a|au|aux)$/.test(folded) || /^\d/.test(token)) break;
      kept.push(token);
      if (kept.length >= 4) break;
    }
    if (kept.length) supplier = kept.join(" ");
  }
  let minAmount: number | undefined;
  const amt = s.match(/(?:superieures? a|plus de|au moins|>)\s*([\d\s.]{2,15})/);
  if (amt) {
    const n = parseAmount(amt[1]);
    if (n != null) minAmount = n;
  }
  let range: { from?: string; to?: string } = {};
  if (s.includes("cette annee") || s.includes("cette année") || s.includes("annee en cours")) {
    range = { from: `${now.getUTCFullYear()}-01-01`, to: `${now.getUTCFullYear()}-12-31` };
  } else if (s.includes("ce trimestre") || s.includes("trimestre")) {
    range = quarterBounds(now);
  } else if (s.includes("ce mois") || s.includes("ce mois-ci")) {
    range = monthBounds(now.getUTCFullYear(), now.getUTCMonth() + 1);
  } else {
    for (const [name, month] of Object.entries(MONTHS)) {
      if (s.includes(name)) {
        const yMatch = s.match(/20\d{2}/);
        const year = yMatch ? Number(yMatch[0]) : now.getUTCFullYear();
        range = monthBounds(year, month);
        break;
      }
    }
  }
  if (s.includes("expir") || s.includes("echeance") || s.includes("échéance") || (s.includes("fin") && s.includes("contrat"))) {
    const from = range.from ?? now.toISOString().slice(0, 10);
    const to = range.to ?? monthBounds(now.getUTCFullYear(), now.getUTCMonth() + 1).to;
    return { type: "expiring", from, to, category };
  }
  if (s.includes("combien") || s.includes("nombre")) {
    return { type: "count", category, supplier, minAmount, ...range };
  }
  if (s.includes("somme") || s.includes("total") || s.includes("montant")) {
    return { type: "sum", category: category ?? "facture", supplier, minAmount, ...range };
  }
  if (category || supplier || minAmount != null || range.from) {
    return { type: "list", category, supplier, minAmount, ...range };
  }
  if (s.trim().length > 1) return { type: "list", text: question };
  return { type: "none" };
}

export function excerpt(text: string, query: string, size = 420): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  const f = fold(clean);
  const token = fold(query).split(/\s+/).find((w) => w.length > 3);
  if (!token) return clean.slice(0, size);
  const at = f.indexOf(token);
  if (at < 0) return clean.slice(0, size);
  const start = Math.max(0, at - 80);
  return `${start > 0 ? "…" : ""}${clean.slice(start, start + size)}`;
}

export function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  return crypto.subtle.digest("SHA-256", bytes).then((buf) =>
    [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join(""),
  );
}

export const LEGAL_SIGNATURE_NOTE =
  "Validation interne de circuit. Ce n'est pas une signature électronique qualifiée. La valeur juridique dépend du prestataire (DocuSign, Dropbox Sign ou équivalent), du niveau de signature et du droit applicable, y compris au Cameroun. Aucun avis juridique n'est délivré par la plateforme.";

export const ROLE_LABELS: Record<string, string> = {
  org_admin: "Administrateur",
  director: "Directeur",
  doc_manager: "Gestionnaire documentaire",
  accountant: "Comptable",
  lawyer: "Juriste",
  collaborator: "Collaborateur",
  reader: "Lecteur",
};

const WRITE = new Set(["org_admin", "director", "doc_manager", "accountant", "lawyer", "collaborator"]);
const VALIDATE = new Set(["org_admin", "director", "doc_manager", "accountant", "lawyer"]);
const MANAGE = new Set(["org_admin", "director", "doc_manager"]);
const ADMIN = new Set(["org_admin"]);
const BILLING = new Set(["org_admin", "director"]);

export function can(role: string, action: "write" | "validate" | "manage" | "admin" | "billing" | "read"): boolean {
  if (action === "read") return true;
  if (action === "write") return WRITE.has(role);
  if (action === "validate") return VALIDATE.has(role);
  if (action === "manage") return MANAGE.has(role);
  if (action === "admin") return ADMIN.has(role);
  if (action === "billing") return BILLING.has(role);
  return false;
}

export function effectivePlan(
  status: string,
  planCode: string,
  trialEndsOn: string | null,
  today: string,
  periodEnd?: string | null,
): {
  code: string;
  writesBlocked: boolean;
} {
  if (status === "canceling" && periodEnd && periodEnd < today) return { code: planCode, writesBlocked: true };
  if (status === "suspended" || status === "cancelled") return { code: planCode, writesBlocked: true };
  if (status === "trial") {
    if (trialEndsOn && trialEndsOn < today) return { code: "starter", writesBlocked: true };
    return { code: "business", writesBlocked: false };
  }
  return { code: planCode, writesBlocked: false };
}
