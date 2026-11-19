alter table subscriptions add column if not exists stripe_customer_id text not null default '';
alter table subscriptions add column if not exists stripe_subscription_id text not null default '';

alter table billing_invoices add column if not exists stripe_invoice_id text;
alter table billing_invoices add column if not exists amount_eur_cents integer not null default 0;

create unique index if not exists billing_invoices_stripe_id_uq
  on billing_invoices (stripe_invoice_id)
  where stripe_invoice_id is not null;

create table if not exists stripe_events (
  id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);
