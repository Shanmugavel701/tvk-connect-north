
-- Roles
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid());
create policy "admins read all roles" on public.user_roles for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Complaints
create sequence public.complaint_seq start 1001;

create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  complaint_id text unique not null default ('TVK-CBE-N-' || nextval('public.complaint_seq')::text),
  name text not null,
  mobile text not null,
  address text not null,
  category text not null,
  area text not null,
  description text not null,
  image_url text,
  status text not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index complaints_mobile_idx on public.complaints(mobile);
create index complaints_complaint_id_idx on public.complaints(complaint_id);

grant select, insert on public.complaints to anon;
grant select, insert, update on public.complaints to authenticated;
grant all on public.complaints to service_role;

alter table public.complaints enable row level security;

-- Anyone can submit a complaint
create policy "anyone can insert complaint" on public.complaints for insert to anon, authenticated
  with check (true);

-- Anyone can look up a complaint (status tracking by ID/mobile is public)
create policy "anyone can read complaints" on public.complaints for select to anon, authenticated
  using (true);

-- Only admins can update
create policy "admins can update complaints" on public.complaints for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger complaints_updated_at before update on public.complaints
  for each row execute function public.set_updated_at();

-- Storage bucket
insert into storage.buckets (id, name, public) values ('complaint-uploads', 'complaint-uploads', true);

create policy "public read complaint uploads" on storage.objects for select
  using (bucket_id = 'complaint-uploads');
create policy "anyone can upload complaint files" on storage.objects for insert
  with check (bucket_id = 'complaint-uploads');
