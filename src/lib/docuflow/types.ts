export type OrgSummary = {
  id: string;
  name: string;
  country: string;
  role: string;
  planCode: string;
  planName: string;
  status: string;
  trialEndsOn: string | null;
  writesBlocked: boolean;
  features: string;
};

export type Bootstrap = {
  userName: string;
  userEmail: string;
  platformAdmin: boolean;
  orgs: OrgSummary[];
};

export type DocRow = {
  id: string;
  title: string;
  fileName: string;
  mime: string;
  byteSize: number;
  status: string;
  categorySlug: string;
  categoryName: string;
  confidence: number;
  supplier: string;
  clientName: string;
  docNumber: string;
  issueDate: string | null;
  dueDate: string | null;
  amountTtc: number | null;
  currency: string;
  summary: string;
  archived: boolean;
  folderId: string | null;
  createdAt: string;
};

export type ImportResult = {
  fileName: string;
  status: string;
  documentId: string | null;
  message: string;
  category: string;
};
