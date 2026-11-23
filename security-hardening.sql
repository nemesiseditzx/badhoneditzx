-- Badhon EditZX production permissions hardening.
-- RLS policies remain the authorization boundary:
--   anon/authenticated: published content SELECT only
--   authenticated admin (app_metadata.role = 'admin'): content UPDATE
-- Do not grant anon write access or allow arbitrary user metadata to define roles.

REVOKE ALL PRIVILEGES ON TABLE public.site_content FROM anon, authenticated;
GRANT SELECT ON TABLE public.site_content TO anon, authenticated;
GRANT UPDATE ON TABLE public.site_content TO authenticated;

-- Verification: anon write privileges and authenticated insert/delete must be false.
SELECT
  has_table_privilege('anon', 'public.site_content', 'select') AS anon_can_read,
  has_table_privilege('anon', 'public.site_content', 'update') AS anon_can_update,
  has_table_privilege('anon', 'public.site_content', 'delete') AS anon_can_delete,
  has_table_privilege('authenticated', 'public.site_content', 'update') AS authenticated_has_update_grant,
  has_table_privilege('authenticated', 'public.site_content', 'insert') AS authenticated_can_insert,
  has_table_privilege('authenticated', 'public.site_content', 'delete') AS authenticated_can_delete;
