-- Optionale steuerliche / handelsregisterliche Angaben aus dem Checkout
alter table shop.orders add column if not exists tax_number text;
alter table shop.orders add column if not exists hrb text;
