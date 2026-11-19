alter table documents add column if not exists payment_status text not null default 'unpaid';

create table if not exists document_files (
  document_id text primary key,
  organization_id text not null,
  mime text not null,
  byte_size integer not null,
  content_base64 text not null
);
