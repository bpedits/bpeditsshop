-- ===========================================================================
-- Schema `shop` für Bavaria Peptides — Bestellungen, Admin-Auth, Audit.
--
-- Im Supabase Dashboard ausführen:
--   1. Bavaria-Peptides-Projekt öffnen
--   2. SQL Editor → New query → diesen Inhalt einfügen → "Run"
-- ===========================================================================

create schema if not exists shop;

-- ---------------------------------------------------------------------------
-- Admin-Benutzer
-- ---------------------------------------------------------------------------
create table if not exists shop.users (
  id            text primary key,
  email         text not null unique,
  name          text not null,
  password_hash text not null,
  created_at    timestamptz not null default now(),
  last_login_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Sessions (signed cookie -> id)
-- ---------------------------------------------------------------------------
create table if not exists shop.sessions (
  id          text primary key,
  user_id     text not null references shop.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  user_agent  text,
  ip          text
);
create index if not exists sessions_user_id_idx on shop.sessions(user_id);
create index if not exists sessions_expires_at_idx on shop.sessions(expires_at);

-- ---------------------------------------------------------------------------
-- 2FA-Login-Codes (Einmal-Codes per Mail)
-- ---------------------------------------------------------------------------
create table if not exists shop.login_codes (
  id         text primary key,
  user_id    text not null references shop.users(id) on delete cascade,
  code_hash  text not null,
  expires_at timestamptz not null,
  attempts   int not null default 0,
  consumed   boolean not null default false,
  ip         text,
  created_at timestamptz not null default now()
);
create index if not exists login_codes_user_id_idx on shop.login_codes(user_id);
create index if not exists login_codes_expires_at_idx on shop.login_codes(expires_at);

-- ---------------------------------------------------------------------------
-- Bestellungen (Stamm)
-- ---------------------------------------------------------------------------
create table if not exists shop.orders (
  order_ref            text primary key,
  created_at           timestamptz not null default now(),
  email                text not null,
  name                 text not null,
  company              text,
  note                 text,
  promo_code           text,
  shipping_country     text not null default 'DE',
  shipping_bundesland_code  text not null,
  shipping_bundesland_label text not null,
  shipping_street_line1     text not null,
  shipping_street_line2     text,
  shipping_postal_code text not null,
  shipping_city        text not null,
  total_eur            numeric(12,2) not null,
  bank_account_holder  text not null,
  bank_iban            text not null,
  bank_bic             text not null,
  bank_institution     text
);
create index if not exists orders_created_at_idx on shop.orders(created_at desc);
create index if not exists orders_email_idx on shop.orders(lower(email));

-- ---------------------------------------------------------------------------
-- Bestellpositionen
-- ---------------------------------------------------------------------------
create table if not exists shop.order_lines (
  id              bigserial primary key,
  order_ref       text not null references shop.orders(order_ref) on delete cascade,
  sku             text not null,
  product_slug    text not null,
  product_name    text not null,
  pack_label      text not null,
  qty             int not null check (qty > 0),
  list_price_eur  numeric(12,2) not null check (list_price_eur >= 0)
);
create index if not exists order_lines_order_ref_idx on shop.order_lines(order_ref);

-- ---------------------------------------------------------------------------
-- Bestell-Status + interne Notiz
-- ---------------------------------------------------------------------------
do $$ begin
  if not exists (select 1 from pg_type where typname = 'order_status_enum') then
    create type shop.order_status_enum as enum ('open','paid','shipped','cancelled');
  end if;
end $$;

create table if not exists shop.order_status (
  order_ref          text primary key references shop.orders(order_ref) on delete cascade,
  status             shop.order_status_enum not null default 'open',
  internal_note      text,
  updated_at         timestamptz not null default now(),
  updated_by_user_id text references shop.users(id) on delete set null
);
create index if not exists order_status_status_idx on shop.order_status(status);

-- ---------------------------------------------------------------------------
-- Audit-Log (append-only)
-- ---------------------------------------------------------------------------
create table if not exists shop.audit_log (
  id              bigserial primary key,
  ts              timestamptz not null default now(),
  actor_user_id   text references shop.users(id) on delete set null,
  actor_email     text,
  type            text not null,
  details         jsonb,
  ip              text
);
create index if not exists audit_log_ts_idx on shop.audit_log(ts desc);
create index if not exists audit_log_type_idx on shop.audit_log(type);

-- ---------------------------------------------------------------------------
-- RLS strikt: Zugriff NUR über Service-Role-Key vom Server.
-- Kein anon-Zugang, keine Policies nötig (Service-Role bypassed RLS).
-- ---------------------------------------------------------------------------
alter table shop.users         enable row level security;
alter table shop.sessions      enable row level security;
alter table shop.login_codes   enable row level security;
alter table shop.orders        enable row level security;
alter table shop.order_lines   enable row level security;
alter table shop.order_status  enable row level security;
alter table shop.audit_log     enable row level security;

revoke all on schema shop from anon, authenticated;
revoke all on all tables in schema shop from anon, authenticated;
revoke all on all sequences in schema shop from anon, authenticated;

-- Service-Role darf alles im shop-Schema (Server-Zugriff via Service-Role-Key)
grant usage on schema shop to service_role;
grant all on all tables in schema shop to service_role;
grant all on all sequences in schema shop to service_role;
alter default privileges in schema shop grant all on tables to service_role;
alter default privileges in schema shop grant all on sequences to service_role;

-- PostgREST: `shop` als exposed schema freigeben.
-- Alternativ via Dashboard: Settings → API → Exposed schemas → `shop` ergänzen.
alter role authenticator set pgrst.db_schemas = 'public, graphql_public, shop';
notify pgrst, 'reload config';
notify pgrst, 'reload schema';
