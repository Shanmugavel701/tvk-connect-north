
alter function public.set_updated_at() set search_path = public;

revoke execute on function public.has_role(uuid, public.app_role) from anon, authenticated, public;
grant execute on function public.has_role(uuid, public.app_role) to service_role;

-- Restrict listing in bucket (objects still public via direct URL, but no listing)
drop policy if exists "public read complaint uploads" on storage.objects;
