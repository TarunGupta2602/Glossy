-- Create cart_items table
create table if not exists public.cart_items (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1,
  created_at timestamp with time zone null default now(),
  constraint cart_items_pkey primary key (id),
  constraint cart_items_user_product_unique unique (user_id, product_id)
);

-- Enable Row Level Security
alter table public.cart_items enable row level security;

-- Policies
create policy "Users can view their own cart items."
  on public.cart_items for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own cart items."
  on public.cart_items for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own cart items."
  on public.cart_items for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own cart items."
  on public.cart_items for delete
  using ( auth.uid() = user_id );
