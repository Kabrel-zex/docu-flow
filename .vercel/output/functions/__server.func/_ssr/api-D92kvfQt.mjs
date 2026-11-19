import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CLtRxzBC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-D92kvfQt.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function obj(input) {
	if (!input || typeof input !== "object") throw new Error("Requête invalide.");
	return input;
}
function orgIdOf(input) {
	const id = obj(input).orgId;
	if (typeof id !== "string" || id.length < 8) throw new Error("Organisation invalide.");
	return id;
}
var getBootstrap_createServerFn_handler = createServerRpc({
	id: "b59da783cb77d1f08559062d95dab3805a72bb5762594a258111eef2741c823b",
	name: "getBootstrap",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getBootstrap.__executeServer(opts));
var getBootstrap = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getBootstrap_createServerFn_handler, async ({ context }) => {
	const { bootstrap } = await import("./store.server-D7iQq_dP.mjs");
	return bootstrap(context.userId);
});
var getDashboard_createServerFn_handler = createServerRpc({
	id: "95e1ad2cc3f34be461c0070f1e7f70bdffcc0beb0c350725b6c8b3b7c761ab5d",
	name: "getDashboard",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(getDashboard_createServerFn_handler, async ({ context, data }) => {
	const { dashboard } = await import("./store.server-D7iQq_dP.mjs");
	return dashboard(context.userId, data.orgId);
});
var getDocuments_createServerFn_handler = createServerRpc({
	id: "b3b1bcb91776f161451b937393d56fbc9696d5453028a18e84c0b44e861c9018",
	name: "getDocuments",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getDocuments.__executeServer(opts));
var getDocuments = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		orgId: orgIdOf(input),
		folderId: typeof o.folderId === "string" ? o.folderId : "",
		status: typeof o.status === "string" ? o.status : "",
		q: typeof o.q === "string" ? o.q : ""
	};
}).handler(getDocuments_createServerFn_handler, async ({ context, data }) => {
	const { listDocuments } = await import("./store.server-D7iQq_dP.mjs");
	return listDocuments(context.userId, data.orgId, data.folderId, data.status, data.q);
});
var getDocument_createServerFn_handler = createServerRpc({
	id: "31d6edfce663071069dca0dce086b4d2244e37a9204c0b775f58da3ca4ff68e3",
	name: "getDocument",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getDocument.__executeServer(opts));
var getDocument = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	if (typeof o.id !== "string") throw new Error("Document invalide.");
	return {
		orgId: orgIdOf(input),
		id: o.id
	};
}).handler(getDocument_createServerFn_handler, async ({ context, data }) => {
	const { getDocument } = await import("./store.server-D7iQq_dP.mjs");
	return getDocument(context.userId, data.orgId, data.id);
});
var importDocuments_createServerFn_handler = createServerRpc({
	id: "b600e8bff09c0df1f8a11302c41f7d64daa9c0bf0e1701e91555acc52bb0b0e9",
	name: "importDocuments",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => importDocuments.__executeServer(opts));
var importDocuments = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
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
				pdfBase64: typeof f.pdfBase64 === "string" && f.pdfBase64.length <= 17e5 ? f.pdfBase64 : ""
			};
		})
	};
}).handler(importDocuments_createServerFn_handler, async ({ context, data }) => {
	const { importBatch } = await import("./store.server-D7iQq_dP.mjs");
	return importBatch(context.userId, data);
});
var actOnDocument_createServerFn_handler = createServerRpc({
	id: "aa2efdc0ec1b0acb4c041f7521506a2fa7627a43a410726740fb6d563f7e715a",
	name: "actOnDocument",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => actOnDocument.__executeServer(opts));
var actOnDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	if (typeof o.id !== "string" || !o.action || typeof o.action !== "object") throw new Error("Action invalide.");
	const action = o.action;
	if (typeof action.type !== "string") throw new Error("Action invalide.");
	return {
		orgId: orgIdOf(input),
		id: o.id,
		action
	};
}).handler(actOnDocument_createServerFn_handler, async ({ context, data }) => {
	const { documentAction } = await import("./store.server-D7iQq_dP.mjs");
	return documentAction(context.userId, data.orgId, data.id, data.action);
});
var getFolders_createServerFn_handler = createServerRpc({
	id: "ff13399e952f85b150314f9121882454aba82c9ece1ca414aba4713cb45f73a9",
	name: "getFolders",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getFolders.__executeServer(opts));
var getFolders = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(getFolders_createServerFn_handler, async ({ context, data }) => {
	const { listFolders } = await import("./store.server-D7iQq_dP.mjs");
	return listFolders(context.userId, data.orgId);
});
var createFolder_createServerFn_handler = createServerRpc({
	id: "3178563a50720cd221e18eae77cd99ad77d1785e3e3c278f36b66efae7d42fef",
	name: "createFolder",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => createFolder.__executeServer(opts));
var createFolder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		orgId: orgIdOf(input),
		name: typeof o.name === "string" ? o.name : "",
		parentId: typeof o.parentId === "string" ? o.parentId : ""
	};
}).handler(createFolder_createServerFn_handler, async ({ context, data }) => {
	const { saveFolder } = await import("./store.server-D7iQq_dP.mjs");
	return saveFolder(context.userId, data.orgId, data.name, data.parentId);
});
var searchDocuments_createServerFn_handler = createServerRpc({
	id: "caea5002ab252aa68e2cc6e7c306fc3222d00f518a21871d70f4af1457a9e73a",
	name: "searchDocuments",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => searchDocuments.__executeServer(opts));
var searchDocuments = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		orgId: orgIdOf(input),
		q: typeof o.q === "string" ? o.q : "",
		natural: Boolean(o.natural)
	};
}).handler(searchDocuments_createServerFn_handler, async ({ context, data }) => {
	const { searchDocs } = await import("./store.server-D7iQq_dP.mjs");
	return searchDocs(context.userId, data.orgId, data.q, data.natural);
});
var ask_createServerFn_handler = createServerRpc({
	id: "a099b9e91df790e1635566f003064068e65adb7fb3b04f253160d380a8e43f85",
	name: "ask",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => ask.__executeServer(opts));
var ask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		orgId: orgIdOf(input),
		conversationId: typeof o.conversationId === "string" ? o.conversationId : "",
		question: typeof o.question === "string" ? o.question : ""
	};
}).handler(ask_createServerFn_handler, async ({ context, data }) => {
	const { askAssistant } = await import("./store.server-D7iQq_dP.mjs");
	return askAssistant(context.userId, data.orgId, data.conversationId, data.question);
});
var getMessages_createServerFn_handler = createServerRpc({
	id: "ad66dda5cd7e11fd546d7209710b20ec2356a01a66c3c29c4366db1a57ee7cf9",
	name: "getMessages",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getMessages.__executeServer(opts));
var getMessages = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		orgId: orgIdOf(input),
		conversationId: typeof o.conversationId === "string" ? o.conversationId : ""
	};
}).handler(getMessages_createServerFn_handler, async ({ context, data }) => {
	const { listMessages } = await import("./store.server-D7iQq_dP.mjs");
	return listMessages(context.userId, data.orgId, data.conversationId);
});
var getContracts_createServerFn_handler = createServerRpc({
	id: "c437d2b0ae3493fe190e64ac817fd3226abb456f2f0879c80e94d76246af7efe",
	name: "getContracts",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getContracts.__executeServer(opts));
var getContracts = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(getContracts_createServerFn_handler, async ({ context, data }) => {
	const { listContracts } = await import("./store.server-D7iQq_dP.mjs");
	return listContracts(context.userId, data.orgId);
});
var actOnContract_createServerFn_handler = createServerRpc({
	id: "4c932392653de520b77b9d790905c908353116e7bdd1f858cb40d6ba248814fa",
	name: "actOnContract",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => actOnContract.__executeServer(opts));
var actOnContract = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		orgId: orgIdOf(input),
		id: typeof o.id === "string" ? o.id : "",
		status: typeof o.status === "string" ? o.status : "",
		autoRenew: typeof o.autoRenew === "boolean" ? o.autoRenew : null
	};
}).handler(actOnContract_createServerFn_handler, async ({ context, data }) => {
	const { contractAction } = await import("./store.server-D7iQq_dP.mjs");
	return contractAction(context.userId, data.orgId, data.id, data.status, data.autoRenew);
});
var getSignatures_createServerFn_handler = createServerRpc({
	id: "6f5764f4316cd66a831c3c51307ee24642ee23b75df9c0373539bcb5c5d33497",
	name: "getSignatures",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getSignatures.__executeServer(opts));
var getSignatures = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(getSignatures_createServerFn_handler, async ({ context, data }) => {
	const { listSignatures } = await import("./store.server-D7iQq_dP.mjs");
	return listSignatures(context.userId, data.orgId);
});
var actOnSignature_createServerFn_handler = createServerRpc({
	id: "7af82d4584d86300f02b3a3e0be62a6b00656e6449219560c39a665656ca4d4b",
	name: "actOnSignature",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => actOnSignature.__executeServer(opts));
var actOnSignature = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	orgId: orgIdOf(input),
	payload: obj(input)
})).handler(actOnSignature_createServerFn_handler, async ({ context, data }) => {
	const { signatureAction } = await import("./store.server-D7iQq_dP.mjs");
	return signatureAction(context.userId, data.orgId, data.payload);
});
var getAlerts_createServerFn_handler = createServerRpc({
	id: "e04e2ff5820e68475c1af13531b244abf8d64a6699adfc52e9e2ffa5bce5e4cd",
	name: "getAlerts",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getAlerts.__executeServer(opts));
var getAlerts = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(getAlerts_createServerFn_handler, async ({ context, data }) => {
	const { listAlerts } = await import("./store.server-D7iQq_dP.mjs");
	return listAlerts(context.userId, data.orgId);
});
var saveAlerts_createServerFn_handler = createServerRpc({
	id: "4d16bbb1140b80272163a3c265053f8013ce9c7aaf2eae35bd33579c84faf7b4",
	name: "saveAlerts",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => saveAlerts.__executeServer(opts));
var saveAlerts = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	const channels = obj(o.channels ?? {});
	return {
		orgId: orgIdOf(input),
		days: typeof o.days === "string" ? o.days : "90,30,15,7,1",
		channels: {
			inapp: channels.inapp !== false,
			email: Boolean(channels.email),
			whatsapp: Boolean(channels.whatsapp),
			sms: Boolean(channels.sms)
		}
	};
}).handler(saveAlerts_createServerFn_handler, async ({ context, data }) => {
	const { saveAlertRules } = await import("./store.server-D7iQq_dP.mjs");
	return saveAlertRules(context.userId, data.orgId, data.days, data.channels);
});
var readNotifications_createServerFn_handler = createServerRpc({
	id: "36c4a02b8bd83e468626f74c57d49bd9338a1086932d53bb3c895dcf47ca74e8",
	name: "readNotifications",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => readNotifications.__executeServer(opts));
var readNotifications = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(readNotifications_createServerFn_handler, async ({ context, data }) => {
	const { markNotifications } = await import("./store.server-D7iQq_dP.mjs");
	return markNotifications(context.userId, data.orgId);
});
var getWorkflows_createServerFn_handler = createServerRpc({
	id: "355ac61bded420272cf8ca92358858b2e19c312a9efe87a36350fecd57b56c4e",
	name: "getWorkflows",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getWorkflows.__executeServer(opts));
var getWorkflows = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(getWorkflows_createServerFn_handler, async ({ context, data }) => {
	const { listWorkflows } = await import("./store.server-D7iQq_dP.mjs");
	return listWorkflows(context.userId, data.orgId);
});
var actOnWorkflow_createServerFn_handler = createServerRpc({
	id: "5fe1eb6ba272a7c2cdd18180238ab7a50a7c6fc1cfacc70e81b12922ed65b31d",
	name: "actOnWorkflow",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => actOnWorkflow.__executeServer(opts));
var actOnWorkflow = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	orgId: orgIdOf(input),
	payload: obj(input)
})).handler(actOnWorkflow_createServerFn_handler, async ({ context, data }) => {
	const { workflowAction } = await import("./store.server-D7iQq_dP.mjs");
	return workflowAction(context.userId, data.orgId, data.payload);
});
var getReports_createServerFn_handler = createServerRpc({
	id: "2421929189f7a845593a911b9fa14f0dc09556f0b05ef859daef45bd5c4d32bc",
	name: "getReports",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getReports.__executeServer(opts));
var getReports = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(getReports_createServerFn_handler, async ({ context, data }) => {
	const { reports } = await import("./store.server-D7iQq_dP.mjs");
	return reports(context.userId, data.orgId);
});
var getTeam_createServerFn_handler = createServerRpc({
	id: "ad02e2aab8f61436b2b30aef68154bb3fe0c6a5e2f021c8735c288ec49327a16",
	name: "getTeam",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getTeam.__executeServer(opts));
var getTeam = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(getTeam_createServerFn_handler, async ({ context, data }) => {
	const { team } = await import("./store.server-D7iQq_dP.mjs");
	return team(context.userId, data.orgId);
});
var actOnTeam_createServerFn_handler = createServerRpc({
	id: "2207af9586cff3b5d12ef79eea28f76fd28b5c7ec7b8b7de2fb61ea0096beae3",
	name: "actOnTeam",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => actOnTeam.__executeServer(opts));
var actOnTeam = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	orgId: orgIdOf(input),
	payload: obj(input)
})).handler(actOnTeam_createServerFn_handler, async ({ context, data }) => {
	const { teamAction } = await import("./store.server-D7iQq_dP.mjs");
	return teamAction(context.userId, data.orgId, data.payload);
});
var getSettings_createServerFn_handler = createServerRpc({
	id: "5956e39a295dde70a9c6055f5ccb2da1984a5ed1d4d732215aea4680daeec411",
	name: "getSettings",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getSettings.__executeServer(opts));
var getSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(getSettings_createServerFn_handler, async ({ context, data }) => {
	const { getSettings } = await import("./store.server-D7iQq_dP.mjs");
	return getSettings(context.userId, data.orgId);
});
var saveSettings_createServerFn_handler = createServerRpc({
	id: "fb624a7d6d8bca6c69b8c214daa844b9c7d8c4d8ac59fa38b6085765b7a31776",
	name: "saveSettings",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => saveSettings.__executeServer(opts));
var saveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	orgId: orgIdOf(input),
	payload: obj(input)
})).handler(saveSettings_createServerFn_handler, async ({ context, data }) => {
	const { saveSettings } = await import("./store.server-D7iQq_dP.mjs");
	return saveSettings(context.userId, data.orgId, data.payload);
});
var getInvoices_createServerFn_handler = createServerRpc({
	id: "eefe89bd47f134672fe7b78f76bd0c4182ab91f3c6e29b8cf81cb92e2ecd5954",
	name: "getInvoices",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getInvoices.__executeServer(opts));
var getInvoices = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(getInvoices_createServerFn_handler, async ({ context, data }) => {
	const { listInvoices } = await import("./store.server-D7iQq_dP.mjs");
	return listInvoices(context.userId, data.orgId);
});
var getInvoicePdf_createServerFn_handler = createServerRpc({
	id: "5c0d6271957159e252d9fb9ff9534e7a016bc655dfed91164a5e355ca7b9e739",
	name: "getInvoicePdf",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getInvoicePdf.__executeServer(opts));
var getInvoicePdf = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const id = obj(input).id;
	if (typeof id !== "string" || id.length < 8) throw new Error("Facture invalide.");
	return {
		orgId: orgIdOf(input),
		id
	};
}).handler(getInvoicePdf_createServerFn_handler, async ({ context, data }) => {
	const { invoicePdf } = await import("./store.server-D7iQq_dP.mjs");
	return invoicePdf(context.userId, data.orgId, data.id);
});
var getBillingPdf_createServerFn_handler = createServerRpc({
	id: "8feb2d66ce084b08c784f1e451ed772ec9200c56333c2000627ffb4cba2021a1",
	name: "getBillingPdf",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getBillingPdf.__executeServer(opts));
var getBillingPdf = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const number = obj(input).number;
	if (typeof number !== "string" || number.length < 3) throw new Error("Facture invalide.");
	return {
		orgId: orgIdOf(input),
		number
	};
}).handler(getBillingPdf_createServerFn_handler, async ({ context, data }) => {
	const { billingInvoicePdf } = await import("./store.server-D7iQq_dP.mjs");
	return billingInvoicePdf(context.userId, data.orgId, data.number);
});
var getBilling_createServerFn_handler = createServerRpc({
	id: "f2065d6a3feb7aaff6cdf5eb34554f2ef427f4f440035bcaed7f5136c9348175",
	name: "getBilling",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getBilling.__executeServer(opts));
var getBilling = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(getBilling_createServerFn_handler, async ({ context, data }) => {
	const { billing } = await import("./store.server-D7iQq_dP.mjs");
	return billing(context.userId, data.orgId);
});
var actOnBilling_createServerFn_handler = createServerRpc({
	id: "29364af107185f7dd0a7240baefae886bb0f858c8dd690e4482117df823a835e",
	name: "actOnBilling",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => actOnBilling.__executeServer(opts));
var actOnBilling = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	orgId: orgIdOf(input),
	payload: obj(input)
})).handler(actOnBilling_createServerFn_handler, async ({ context, data }) => {
	const { billingAction } = await import("./store.server-D7iQq_dP.mjs");
	return billingAction(context.userId, data.orgId, data.payload);
});
var createOrg_createServerFn_handler = createServerRpc({
	id: "fd14e6bacb431c2cf17aa4dbcc8baa4b2b7bd901f53f8b6735193c0d228af4a9",
	name: "createOrg",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => createOrg.__executeServer(opts));
var createOrg = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const name = obj(input).name;
	if (typeof name !== "string" || name.trim().length < 2) throw new Error("Nom d'organisation requis.");
	return { name: name.trim() };
}).handler(createOrg_createServerFn_handler, async ({ context, data }) => {
	const { createOrganization } = await import("./store.server-D7iQq_dP.mjs");
	return createOrganization(context.userId, data.name);
});
var seedDemo_createServerFn_handler = createServerRpc({
	id: "f41273729f56b9cebb9e97dd6280284954e6f661393fe1e75f5703d57150b1b8",
	name: "seedDemo",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => seedDemo.__executeServer(opts));
var seedDemo = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(seedDemo_createServerFn_handler, async ({ context, data }) => {
	const { loadDemo } = await import("./store.server-D7iQq_dP.mjs");
	return loadDemo(context.userId, data.orgId);
});
var getAdmin_createServerFn_handler = createServerRpc({
	id: "107f21dd2d0d5d425e0713c31cfa19a3195cf9c472511e453fb5e2c6f9a576f2",
	name: "getAdmin",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getAdmin.__executeServer(opts));
var getAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getAdmin_createServerFn_handler, async ({ context }) => {
	const { adminOverview } = await import("./store.server-D7iQq_dP.mjs");
	return adminOverview(context.userId);
});
var updatePlan_createServerFn_handler = createServerRpc({
	id: "7e5ab300996c731b232cec8184099b204098ccbe96689f5985ff3afd161cbcd3",
	name: "updatePlan",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => updatePlan.__executeServer(opts));
var updatePlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		code: typeof o.code === "string" ? o.code : "",
		price: Number(o.price) || 0,
		docs: Number(o.docs) || 1,
		users: Number(o.users) || 1,
		storage: Number(o.storage) || 1
	};
}).handler(updatePlan_createServerFn_handler, async ({ context, data }) => {
	const { adminUpdatePlan } = await import("./store.server-D7iQq_dP.mjs");
	return adminUpdatePlan(context.userId, data.code, data.price, data.docs, data.users, data.storage);
});
var compareDocs_createServerFn_handler = createServerRpc({
	id: "16f8eb95712f80b39ad2e592ee9d503c22e80405a395d974d73c236b646615d9",
	name: "compareDocs",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => compareDocs.__executeServer(opts));
var compareDocs = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	if (typeof o.a !== "string" || typeof o.b !== "string") throw new Error("Deux documents requis.");
	return {
		orgId: orgIdOf(input),
		a: o.a,
		b: o.b,
		useAi: Boolean(o.useAi)
	};
}).handler(compareDocs_createServerFn_handler, async ({ context, data }) => {
	const { compareDocuments } = await import("./store.server-D7iQq_dP.mjs");
	return compareDocuments(context.userId, data.orgId, data.a, data.b, data.useAi);
});
var getShared_createServerFn_handler = createServerRpc({
	id: "fd3c9cbb4853e99695137c012fb2754de091feaf4de885d95a34d2b5a5ad7e7a",
	name: "getShared",
	filename: "src/lib/docuflow/api.ts"
}, (opts) => getShared.__executeServer(opts));
var getShared = createServerFn({ method: "GET" }).validator((input) => {
	const token = obj(input).token;
	if (typeof token !== "string" || token.length < 16) throw new Error("Lien invalide.");
	return { token };
}).handler(getShared_createServerFn_handler, async ({ data }) => {
	const { publicShare } = await import("./store.server-D7iQq_dP.mjs");
	return publicShare(data.token);
});
//#endregion
export { actOnBilling_createServerFn_handler, actOnContract_createServerFn_handler, actOnDocument_createServerFn_handler, actOnSignature_createServerFn_handler, actOnTeam_createServerFn_handler, actOnWorkflow_createServerFn_handler, ask_createServerFn_handler, compareDocs_createServerFn_handler, createFolder_createServerFn_handler, createOrg_createServerFn_handler, getAdmin_createServerFn_handler, getAlerts_createServerFn_handler, getBillingPdf_createServerFn_handler, getBilling_createServerFn_handler, getBootstrap_createServerFn_handler, getContracts_createServerFn_handler, getDashboard_createServerFn_handler, getDocument_createServerFn_handler, getDocuments_createServerFn_handler, getFolders_createServerFn_handler, getInvoicePdf_createServerFn_handler, getInvoices_createServerFn_handler, getMessages_createServerFn_handler, getReports_createServerFn_handler, getSettings_createServerFn_handler, getShared_createServerFn_handler, getSignatures_createServerFn_handler, getTeam_createServerFn_handler, getWorkflows_createServerFn_handler, importDocuments_createServerFn_handler, readNotifications_createServerFn_handler, saveAlerts_createServerFn_handler, saveSettings_createServerFn_handler, searchDocuments_createServerFn_handler, seedDemo_createServerFn_handler, updatePlan_createServerFn_handler };
