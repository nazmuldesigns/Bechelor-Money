-- Bachelor Money — per-user money, people, and ledger schema.
-- Every tenant-owned table is keyed by user_id (text).

create table if not exists profiles (
  user_id text primary key,
  display_name text,
  currency text not null default 'BDT',
  dismissed_version text,
  created_at timestamptz not null default now()
);

create table if not exists people (
  id text primary key,
  user_id text not null,
  name text not null,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists people_user_id_idx on people (user_id);

create table if not exists categories (
  id text primary key,
  user_id text not null,
  name text not null,
  kind text not null check (kind in ('income', 'expense')),
  created_at timestamptz not null default now()
);
create index if not exists categories_user_id_idx on categories (user_id);

create table if not exists splits (
  id text primary key,
  user_id text not null,
  total numeric(14, 2) not null,
  my_share numeric(14, 2) not null,
  created_at timestamptz not null default now()
);

create table if not exists split_shares (
  id text primary key,
  split_id text not null,
  user_id text not null,
  person_id text,
  share numeric(14, 2) not null
);
create index if not exists split_shares_split_idx on split_shares (split_id);

create table if not exists transactions (
  id text primary key,
  user_id text not null,
  kind text not null check (kind in ('income', 'expense')),
  source text not null check (
    source in ('plain', 'borrow', 'lend', 'repay', 'collect', 'split')
  ),
  amount numeric(14, 2) not null,
  category_id text,
  person_id text,
  split_id text,
  note text,
  occurred_on date not null default current_date,
  created_at timestamptz not null default now()
);
create index if not exists transactions_user_id_idx on transactions (user_id);
create index if not exists transactions_occurred_idx on transactions (user_id, occurred_on desc);

-- Signed ledger: +delta means they owe me more; -delta means I owe them more.
create table if not exists ledger_events (
  id text primary key,
  user_id text not null,
  person_id text not null,
  transaction_id text not null,
  delta numeric(14, 2) not null,
  created_at timestamptz not null default now()
);
create index if not exists ledger_events_user_person_idx on ledger_events (user_id, person_id);
create index if not exists ledger_events_txn_idx on ledger_events (transaction_id);

create table if not exists app_notices (
  id serial primary key,
  version text not null unique,
  title text not null,
  body text not null,
  cta_label text,
  created_at timestamptz not null default now()
);

create table if not exists feedback (
  id serial primary key,
  user_id text not null,
  message text not null,
  created_at timestamptz not null default now()
);

insert into app_notices (version, title, body, cta_label)
values (
  '1.1.0',
  'Smarter money, quieter nights',
  'Debt netting, equal splits, and a calculator that sits next to your keyboard. Your ledger now settles itself.',
  'Got it'
);
