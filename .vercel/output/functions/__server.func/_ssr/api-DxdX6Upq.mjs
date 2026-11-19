import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CLtRxzBC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-DxdX6Upq.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var getBootstrap = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b59da783cb77d1f08559062d95dab3805a72bb5762594a258111eef2741c823b"));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("95e1ad2cc3f34be461c0070f1e7f70bdffcc0beb0c350725b6c8b3b7c761ab5d"));
var getDocuments = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		orgId: orgIdOf(input),
		folderId: typeof o.folderId === "string" ? o.folderId : "",
		status: typeof o.status === "string" ? o.status : "",
		q: typeof o.q === "string" ? o.q : ""
	};
}).handler(createSsrRpc("b3b1bcb91776f161451b937393d56fbc9696d5453028a18e84c0b44e861c9018"));
var getDocument = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	if (typeof o.id !== "string") throw new Error("Document invalide.");
	return {
		orgId: orgIdOf(input),
		id: o.id
	};
}).handler(createSsrRpc("31d6edfce663071069dca0dce086b4d2244e37a9204c0b775f58da3ca4ff68e3"));
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
}).handler(createSsrRpc("b600e8bff09c0df1f8a11302c41f7d64daa9c0bf0e1701e91555acc52bb0b0e9"));
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
}).handler(createSsrRpc("aa2efdc0ec1b0acb4c041f7521506a2fa7627a43a410726740fb6d563f7e715a"));
var getFolders = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("ff13399e952f85b150314f9121882454aba82c9ece1ca414aba4713cb45f73a9"));
var createFolder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		orgId: orgIdOf(input),
		name: typeof o.name === "string" ? o.name : "",
		parentId: typeof o.parentId === "string" ? o.parentId : ""
	};
}).handler(createSsrRpc("3178563a50720cd221e18eae77cd99ad77d1785e3e3c278f36b66efae7d42fef"));
var searchDocuments = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		orgId: orgIdOf(input),
		q: typeof o.q === "string" ? o.q : "",
		natural: Boolean(o.natural)
	};
}).handler(createSsrRpc("caea5002ab252aa68e2cc6e7c306fc3222d00f518a21871d70f4af1457a9e73a"));
var ask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		orgId: orgIdOf(input),
		conversationId: typeof o.conversationId === "string" ? o.conversationId : "",
		question: typeof o.question === "string" ? o.question : ""
	};
}).handler(createSsrRpc("a099b9e91df790e1635566f003064068e65adb7fb3b04f253160d380a8e43f85"));
var getMessages = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		orgId: orgIdOf(input),
		conversationId: typeof o.conversationId === "string" ? o.conversationId : ""
	};
}).handler(createSsrRpc("ad66dda5cd7e11fd546d7209710b20ec2356a01a66c3c29c4366db1a57ee7cf9"));
var getContracts = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("c437d2b0ae3493fe190e64ac817fd3226abb456f2f0879c80e94d76246af7efe"));
var actOnContract = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		orgId: orgIdOf(input),
		id: typeof o.id === "string" ? o.id : "",
		status: typeof o.status === "string" ? o.status : "",
		autoRenew: typeof o.autoRenew === "boolean" ? o.autoRenew : null
	};
}).handler(createSsrRpc("4c932392653de520b77b9d790905c908353116e7bdd1f858cb40d6ba248814fa"));
var getSignatures = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("6f5764f4316cd66a831c3c51307ee24642ee23b75df9c0373539bcb5c5d33497"));
var actOnSignature = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	orgId: orgIdOf(input),
	payload: obj(input)
})).handler(createSsrRpc("7af82d4584d86300f02b3a3e0be62a6b00656e6449219560c39a665656ca4d4b"));
var getAlerts = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("e04e2ff5820e68475c1af13531b244abf8d64a6699adfc52e9e2ffa5bce5e4cd"));
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
}).handler(createSsrRpc("4d16bbb1140b80272163a3c265053f8013ce9c7aaf2eae35bd33579c84faf7b4"));
var readNotifications = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("36c4a02b8bd83e468626f74c57d49bd9338a1086932d53bb3c895dcf47ca74e8"));
var getWorkflows = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("355ac61bded420272cf8ca92358858b2e19c312a9efe87a36350fecd57b56c4e"));
var actOnWorkflow = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	orgId: orgIdOf(input),
	payload: obj(input)
})).handler(createSsrRpc("5fe1eb6ba272a7c2cdd18180238ab7a50a7c6fc1cfacc70e81b12922ed65b31d"));
var getReports = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("2421929189f7a845593a911b9fa14f0dc09556f0b05ef859daef45bd5c4d32bc"));
var getTeam = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("ad02e2aab8f61436b2b30aef68154bb3fe0c6a5e2f021c8735c288ec49327a16"));
var actOnTeam = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	orgId: orgIdOf(input),
	payload: obj(input)
})).handler(createSsrRpc("2207af9586cff3b5d12ef79eea28f76fd28b5c7ec7b8b7de2fb61ea0096beae3"));
var getSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("5956e39a295dde70a9c6055f5ccb2da1984a5ed1d4d732215aea4680daeec411"));
var saveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	orgId: orgIdOf(input),
	payload: obj(input)
})).handler(createSsrRpc("fb624a7d6d8bca6c69b8c214daa844b9c7d8c4d8ac59fa38b6085765b7a31776"));
var getInvoices = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("eefe89bd47f134672fe7b78f76bd0c4182ab91f3c6e29b8cf81cb92e2ecd5954"));
var getInvoicePdf = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const id = obj(input).id;
	if (typeof id !== "string" || id.length < 8) throw new Error("Facture invalide.");
	return {
		orgId: orgIdOf(input),
		id
	};
}).handler(createSsrRpc("5c0d6271957159e252d9fb9ff9534e7a016bc655dfed91164a5e355ca7b9e739"));
var getBillingPdf = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => {
	const number = obj(input).number;
	if (typeof number !== "string" || number.length < 3) throw new Error("Facture invalide.");
	return {
		orgId: orgIdOf(input),
		number
	};
}).handler(createSsrRpc("8feb2d66ce084b08c784f1e451ed772ec9200c56333c2000627ffb4cba2021a1"));
var getBilling = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("f2065d6a3feb7aaff6cdf5eb34554f2ef427f4f440035bcaed7f5136c9348175"));
var actOnBilling = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	orgId: orgIdOf(input),
	payload: obj(input)
})).handler(createSsrRpc("29364af107185f7dd0a7240baefae886bb0f858c8dd690e4482117df823a835e"));
var createOrg = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const name = obj(input).name;
	if (typeof name !== "string" || name.trim().length < 2) throw new Error("Nom d'organisation requis.");
	return { name: name.trim() };
}).handler(createSsrRpc("fd14e6bacb431c2cf17aa4dbcc8baa4b2b7bd901f53f8b6735193c0d228af4a9"));
var seedDemo = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({ orgId: orgIdOf(input) })).handler(createSsrRpc("f41273729f56b9cebb9e97dd6280284954e6f661393fe1e75f5703d57150b1b8"));
var getAdmin = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("107f21dd2d0d5d425e0713c31cfa19a3195cf9c472511e453fb5e2c6f9a576f2"));
var updatePlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	return {
		code: typeof o.code === "string" ? o.code : "",
		price: Number(o.price) || 0,
		docs: Number(o.docs) || 1,
		users: Number(o.users) || 1,
		storage: Number(o.storage) || 1
	};
}).handler(createSsrRpc("7e5ab300996c731b232cec8184099b204098ccbe96689f5985ff3afd161cbcd3"));
var compareDocs = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => {
	const o = obj(input);
	if (typeof o.a !== "string" || typeof o.b !== "string") throw new Error("Deux documents requis.");
	return {
		orgId: orgIdOf(input),
		a: o.a,
		b: o.b,
		useAi: Boolean(o.useAi)
	};
}).handler(createSsrRpc("16f8eb95712f80b39ad2e592ee9d503c22e80405a395d974d73c236b646615d9"));
var getShared = createServerFn({ method: "GET" }).validator((input) => {
	const token = obj(input).token;
	if (typeof token !== "string" || token.length < 16) throw new Error("Lien invalide.");
	return { token };
}).handler(createSsrRpc("fd3c9cbb4853e99695137c012fb2754de091feaf4de885d95a34d2b5a5ad7e7a"));
//#endregion
export { importDocuments as A, getMessages as C, getSignatures as D, getShared as E, seedDemo as F, updatePlan as I, saveAlerts as M, saveSettings as N, getTeam as O, searchDocuments as P, getInvoices as S, getSettings as T, getDashboard as _, actOnTeam as a, getFolders as b, compareDocs as c, getAdmin as d, getAlerts as f, getContracts as g, getBootstrap as h, actOnSignature as i, readNotifications as j, getWorkflows as k, createFolder as l, getBillingPdf as m, actOnContract as n, actOnWorkflow as o, getBilling as p, actOnDocument as r, ask as s, actOnBilling as t, createOrg as u, getDocument as v, getReports as w, getInvoicePdf as x, getDocuments as y };
