-- DOCUFLOW AI domain schema. Per-tenant rows are always scoped by organization
-- membership of the authenticated user (see src/lib/docuflow/api.ts).

create table if not exists organizations (
  id text primary key,
  name text not null,
  legal_name text not null default '',
  address text not null default '',
  country text not null default 'Cameroun',
  phone text not null default '',
  email text not null default '',
  sector text not null default '',
  tax_id text not null default '',
  retention_years integer not null default 10,
  demo_loaded boolean not null default false,
  created_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists departments (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists members (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  user_id text not null,
  role text not null,
  department_id text,
  display_name text not null default '',
  email text not null default '',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists members_user_idx on members (user_id);

create table if not exists invites (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  email text not null,
  role text not null,
  token text not null unique,
  status text not null default 'pending',
  created_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists workspaces (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists folders (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  workspace_id text not null,
  parent_id text,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  slug text not null,
  name text not null,
  is_system boolean not null default true,
  unique (organization_id, slug)
);

create table if not exists documents (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  workspace_id text not null,
  folder_id text,
  uploaded_by text not null,
  title text not null,
  file_name text not null,
  mime text not null,
  byte_size integer not null default 0,
  sha256 text not null,
  status text not null,
  category_slug text not null default 'autre',
  category_confidence real not null default 0,
  content_text text not null default '',
  supplier text not null default '',
  client_name text not null default '',
  doc_number text not null default '',
  issue_date text,
  due_date text,
  amount_ht double precision,
  tax_amount double precision,
  amount_ttc double precision,
  currency text not null default 'XAF',
  summary text not null default '',
  archived boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, sha256)
);

create index if not exists documents_org_idx on documents (organization_id);
create index if not exists documents_org_cat_idx on documents (organization_id, category_slug);

create table if not exists document_versions (
  id text primary key,
  document_id text not null,
  organization_id text not null,
  version_no integer not null,
  note text not null default '',
  sha256 text not null,
  created_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists extractions (
  id text primary key,
  document_id text not null,
  organization_id text not null,
  field_key text not null,
  label text not null,
  value text not null,
  data_type text not null,
  confidence real not null,
  page_no integer,
  status text not null default 'suggested',
  validated_by text
);

create index if not exists extractions_doc_idx on extractions (document_id);

create table if not exists tags (
  id text primary key,
  document_id text not null,
  organization_id text not null,
  tag text not null
);

create table if not exists comments (
  id text primary key,
  document_id text not null,
  organization_id text not null,
  user_id text not null,
  author_name text not null,
  body text not null,
  quote text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id text primary key,
  organization_id text not null,
  document_id text,
  assignee_user_id text,
  created_by text not null,
  title text not null,
  kind text not null,
  status text not null default 'open',
  note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id text primary key,
  organization_id text not null,
  user_id text not null,
  dedupe_key text not null,
  title text not null,
  body text not null,
  href text not null default '',
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, dedupe_key)
);

create table if not exists audit_logs (
  id text primary key,
  organization_id text,
  user_id text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null default '',
  detail text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists audit_org_idx on audit_logs (organization_id);

create table if not exists deadlines (
  id text primary key,
  organization_id text not null,
  document_id text,
  contract_id text,
  kind text not null,
  label text not null,
  due_on text not null,
  status text not null default 'open'
);

create table if not exists contracts (
  id text primary key,
  organization_id text not null,
  document_id text,
  title text not null,
  status text not null,
  counterparty text not null default '',
  object_text text not null default '',
  signed_on text,
  starts_on text,
  ends_on text,
  auto_renew boolean not null default false,
  notice_days integer not null default 30,
  renewal_note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists contract_parties (
  id text primary key,
  contract_id text not null,
  organization_id text not null,
  name text not null,
  role text not null default 'partie'
);

create table if not exists signature_requests (
  id text primary key,
  organization_id text not null,
  document_id text,
  title text not null,
  provider text not null default 'internal_validation',
  status text not null default 'draft',
  integrity_sha256 text not null default '',
  legal_note text not null,
  created_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists signature_signers (
  id text primary key,
  request_id text not null,
  organization_id text not null,
  name text not null,
  email text not null,
  sign_order integer not null default 1,
  status text not null default 'pending'
);

create table if not exists signature_events (
  id text primary key,
  request_id text not null,
  organization_id text not null,
  event text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists workflows (
  id text primary key,
  organization_id text not null,
  name text not null,
  trigger_category text not null default '',
  active boolean not null default true
);

create table if not exists workflow_steps (
  id text primary key,
  workflow_id text not null,
  organization_id text not null,
  position integer not null,
  name text not null,
  kind text not null
);

create table if not exists workflow_runs (
  id text primary key,
  workflow_id text not null,
  organization_id text not null,
  document_id text not null,
  current_step integer not null default 0,
  status text not null default 'running',
  created_at timestamptz not null default now()
);

create table if not exists conversations (
  id text primary key,
  organization_id text not null,
  user_id text not null,
  title text not null,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id text primary key,
  conversation_id text not null,
  organization_id text not null,
  user_id text not null,
  role text not null,
  content text not null,
  sources text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists plans (
  code text primary key,
  name text not null,
  price_xaf integer not null,
  max_orgs integer not null,
  max_users integer not null,
  storage_mb integer not null,
  docs_per_month integer not null,
  assistant_month integer not null,
  features text not null
);

create table if not exists subscriptions (
  id text primary key,
  organization_id text not null unique references organizations(id) on delete cascade,
  plan_code text not null,
  status text not null,
  trial_ends_on text,
  discount_percent integer not null default 0,
  promo_code text not null default '',
  period_end text,
  created_at timestamptz not null default now()
);

create table if not exists billing_invoices (
  id text primary key,
  organization_id text not null,
  number text not null,
  plan_code text not null,
  amount_xaf integer not null,
  status text not null,
  issued_on text not null,
  note text not null default ''
);

create table if not exists promo_codes (
  code text primary key,
  percent_off integer not null,
  active boolean not null default true
);

create table if not exists platform_admins (
  user_id text primary key,
  created_at timestamptz not null default now()
);

create table if not exists alert_rules (
  organization_id text primary key references organizations(id) on delete cascade,
  days text not null default '90,30,15,7,1',
  channel_inapp boolean not null default true,
  channel_email boolean not null default false,
  channel_whatsapp boolean not null default false,
  channel_sms boolean not null default false
);

create table if not exists ai_usage (
  id text primary key,
  organization_id text not null,
  user_id text not null,
  kind text not null,
  created_at timestamptz not null default now()
);

create table if not exists share_links (
  id text primary key,
  organization_id text not null,
  document_id text not null,
  token text not null unique,
  expires_at timestamptz not null,
  created_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists api_tokens (
  id text primary key,
  organization_id text not null,
  user_id text not null,
  label text not null,
  token_hash text not null unique,
  created_at timestamptz not null default now()
);

insert into plans (code, name, price_xaf, max_orgs, max_users, storage_mb, docs_per_month, assistant_month, features)
values
  ('starter', 'Starter', 5000, 1, 2, 2048, 500, 0, 'OCR texte, classification, recherche, alertes, dossiers'),
  ('business', 'Business', 15000, 1, 5, 20480, 2500, 80, 'Extraction avancée, recherche sémantique, assistant, contrats, versions'),
  ('professional', 'Professional', 35000, 1, 15, 102400, 10000, 400, 'Workflows, validations, collaboration, rapports, API, permissions'),
  ('enterprise', 'Enterprise', 100000, 25, 500, 1048576, 100000, 5000, 'Multi-organisations, API avancée, quotas sur contrat, priorité')
on conflict (code) do nothing;

insert into promo_codes (code, percent_off, active) values ('DOCUFLOW30', 30, true)
on conflict (code) do nothing;
