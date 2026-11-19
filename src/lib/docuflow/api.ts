import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";

function obj(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object") throw new Error("Requête invalide.");
  return input as Record<string, unknown>;
}

function orgIdOf(input: unknown): string {
  const id = obj(input).orgId;
  if (typeof id !== "string" || id.length < 8) throw new Error("Organisation invalide.");
  return id;
}

export const getBootstrap = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { bootstrap } = await import("./store.server");
    return bootstrap(context.userId);
  });

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { dashboard } = await import("./store.server");
    return dashboard(context.userId, data.orgId);
  });

export const getDocuments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = obj(input);
    return {
      orgId: orgIdOf(input),
      folderId: typeof o.folderId === "string" ? o.folderId : "",
      status: typeof o.status === "string" ? o.status : "",
      q: typeof o.q === "string" ? o.q : "",
    };
  })
  .handler(async ({ context, data }) => {
    const { listDocuments } = await import("./store.server");
    return listDocuments(context.userId, data.orgId, data.folderId, data.status, data.q);
  });

export const getDocument = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = obj(input);
    if (typeof o.id !== "string") throw new Error("Document invalide.");
    return { orgId: orgIdOf(input), id: o.id };
  })
  .handler(async ({ context, data }) => {
    const { getDocument } = await import("./store.server");
    return getDocument(context.userId, data.orgId, data.id);
  });

export const importDocuments = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = obj(input);
    if (!Array.isArray(o.files)) throw new Error("Fichiers manquants.");
    return {
      orgId: orgIdOf(input),
      folderId: typeof o.folderId === "string" ? o.folderId : null,
      files: o.files.slice(0, 12).map((file) => {
        const f = obj(file);
        return {
          name: typeof f.name === "string" ? f.name : "document",
          mime: typeof f.mime === "string" ? f.mime : "text/plain",
          size: typeof f.size === "number" ? f.size : 0,
          sha256: typeof f.sha256 === "string" ? f.sha256 : "",
          text: typeof f.text === "string" ? f.text : "",
          pdfBase64: typeof f.pdfBase64 === "string" && f.pdfBase64.length <= 1_700_000 ? f.pdfBase64 : "",
        };
      }),
    };
  })
  .handler(async ({ context, data }) => {
    const { importBatch } = await import("./store.server");
    return importBatch(context.userId, data);
  });

export const actOnDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = obj(input);
    if (typeof o.id !== "string" || !o.action || typeof o.action !== "object") throw new Error("Action invalide.");
    const action = o.action as Record<string, unknown>;
    if (typeof action.type !== "string") throw new Error("Action invalide.");
    return { orgId: orgIdOf(input), id: o.id, action };
  })
  .handler(async ({ context, data }) => {
    const { documentAction } = await import("./store.server");
    return documentAction(context.userId, data.orgId, data.id, data.action);
  });

export const getFolders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { listFolders } = await import("./store.server");
    return listFolders(context.userId, data.orgId);
  });

export const createFolder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = obj(input);
    return { orgId: orgIdOf(input), name: typeof o.name === "string" ? o.name : "", parentId: typeof o.parentId === "string" ? o.parentId : "" };
  })
  .handler(async ({ context, data }) => {
    const { saveFolder } = await import("./store.server");
    return saveFolder(context.userId, data.orgId, data.name, data.parentId);
  });

export const searchDocuments = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = obj(input);
    return { orgId: orgIdOf(input), q: typeof o.q === "string" ? o.q : "", natural: Boolean(o.natural) };
  })
  .handler(async ({ context, data }) => {
    const { searchDocs } = await import("./store.server");
    return searchDocs(context.userId, data.orgId, data.q, data.natural);
  });

export const ask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = obj(input);
    return {
      orgId: orgIdOf(input),
      conversationId: typeof o.conversationId === "string" ? o.conversationId : "",
      question: typeof o.question === "string" ? o.question : "",
    };
  })
  .handler(async ({ context, data }) => {
    const { askAssistant } = await import("./store.server");
    return askAssistant(context.userId, data.orgId, data.conversationId, data.question);
  });

export const getMessages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = obj(input);
    return { orgId: orgIdOf(input), conversationId: typeof o.conversationId === "string" ? o.conversationId : "" };
  })
  .handler(async ({ context, data }) => {
    const { listMessages } = await import("./store.server");
    return listMessages(context.userId, data.orgId, data.conversationId);
  });

export const getContracts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { listContracts } = await import("./store.server");
    return listContracts(context.userId, data.orgId);
  });

export const actOnContract = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = obj(input);
    return {
      orgId: orgIdOf(input),
      id: typeof o.id === "string" ? o.id : "",
      status: typeof o.status === "string" ? o.status : "",
      autoRenew: typeof o.autoRenew === "boolean" ? o.autoRenew : null,
    };
  })
  .handler(async ({ context, data }) => {
    const { contractAction } = await import("./store.server");
    return contractAction(context.userId, data.orgId, data.id, data.status, data.autoRenew);
  });

export const getSignatures = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { listSignatures } = await import("./store.server");
    return listSignatures(context.userId, data.orgId);
  });

export const actOnSignature = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input), payload: obj(input) }))
  .handler(async ({ context, data }) => {
    const { signatureAction } = await import("./store.server");
    return signatureAction(context.userId, data.orgId, data.payload);
  });

export const getAlerts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { listAlerts } = await import("./store.server");
    return listAlerts(context.userId, data.orgId);
  });

export const saveAlerts = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = obj(input);
    const channels = obj(o.channels ?? {});
    return {
      orgId: orgIdOf(input),
      days: typeof o.days === "string" ? o.days : "90,30,15,7,1",
      channels: {
        inapp: channels.inapp !== false,
        email: Boolean(channels.email),
        whatsapp: Boolean(channels.whatsapp),
        sms: Boolean(channels.sms),
      },
    };
  })
  .handler(async ({ context, data }) => {
    const { saveAlertRules } = await import("./store.server");
    return saveAlertRules(context.userId, data.orgId, data.days, data.channels);
  });

export const readNotifications = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { markNotifications } = await import("./store.server");
    return markNotifications(context.userId, data.orgId);
  });

export const getWorkflows = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { listWorkflows } = await import("./store.server");
    return listWorkflows(context.userId, data.orgId);
  });

export const actOnWorkflow = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input), payload: obj(input) }))
  .handler(async ({ context, data }) => {
    const { workflowAction } = await import("./store.server");
    return workflowAction(context.userId, data.orgId, data.payload);
  });

export const getReports = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { reports } = await import("./store.server");
    return reports(context.userId, data.orgId);
  });

export const getTeam = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { team } = await import("./store.server");
    return team(context.userId, data.orgId);
  });

export const actOnTeam = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input), payload: obj(input) }))
  .handler(async ({ context, data }) => {
    const { teamAction } = await import("./store.server");
    return teamAction(context.userId, data.orgId, data.payload);
  });

export const getSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { getSettings } = await import("./store.server");
    return getSettings(context.userId, data.orgId);
  });

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input), payload: obj(input) }))
  .handler(async ({ context, data }) => {
    const { saveSettings } = await import("./store.server");
    return saveSettings(context.userId, data.orgId, data.payload);
  });

export const getInvoices = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { listInvoices } = await import("./store.server");
    return listInvoices(context.userId, data.orgId);
  });

export const getInvoicePdf = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const id = obj(input).id;
    if (typeof id !== "string" || id.length < 8) throw new Error("Facture invalide.");
    return { orgId: orgIdOf(input), id };
  })
  .handler(async ({ context, data }) => {
    const { invoicePdf } = await import("./store.server");
    return invoicePdf(context.userId, data.orgId, data.id);
  });

export const getBillingPdf = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const number = obj(input).number;
    if (typeof number !== "string" || number.length < 3) throw new Error("Facture invalide.");
    return { orgId: orgIdOf(input), number };
  })
  .handler(async ({ context, data }) => {
    const { billingInvoicePdf } = await import("./store.server");
    return billingInvoicePdf(context.userId, data.orgId, data.number);
  });

export const getBilling = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { billing } = await import("./store.server");
    return billing(context.userId, data.orgId);
  });

export const actOnBilling = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input), payload: obj(input) }))
  .handler(async ({ context, data }) => {
    const { billingAction } = await import("./store.server");
    return billingAction(context.userId, data.orgId, data.payload);
  });

export const createOrg = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const name = obj(input).name;
    if (typeof name !== "string" || name.trim().length < 2) throw new Error("Nom d'organisation requis.");
    return { name: name.trim() };
  })
  .handler(async ({ context, data }) => {
    const { createOrganization } = await import("./store.server");
    return createOrganization(context.userId, data.name);
  });

export const seedDemo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => ({ orgId: orgIdOf(input) }))
  .handler(async ({ context, data }) => {
    const { loadDemo } = await import("./store.server");
    return loadDemo(context.userId, data.orgId);
  });

export const getAdmin = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { adminOverview } = await import("./store.server");
    return adminOverview(context.userId);
  });

export const updatePlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = obj(input);
    return {
      code: typeof o.code === "string" ? o.code : "",
      price: Number(o.price) || 0,
      docs: Number(o.docs) || 1,
      users: Number(o.users) || 1,
      storage: Number(o.storage) || 1,
    };
  })
  .handler(async ({ context, data }) => {
    const { adminUpdatePlan } = await import("./store.server");
    return adminUpdatePlan(context.userId, data.code, data.price, data.docs, data.users, data.storage);
  });

export const compareDocs = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => {
    const o = obj(input);
    if (typeof o.a !== "string" || typeof o.b !== "string") throw new Error("Deux documents requis.");
    return { orgId: orgIdOf(input), a: o.a, b: o.b, useAi: Boolean(o.useAi) };
  })
  .handler(async ({ context, data }) => {
    const { compareDocuments } = await import("./store.server");
    return compareDocuments(context.userId, data.orgId, data.a, data.b, data.useAi);
  });

export const getShared = createServerFn({ method: "GET" })
  .validator((input: unknown) => {
    const token = obj(input).token;
    if (typeof token !== "string" || token.length < 16) throw new Error("Lien invalide.");
    return { token };
  })
  .handler(async ({ data }) => {
    const { publicShare } = await import("./store.server");
    return publicShare(data.token);
  });
