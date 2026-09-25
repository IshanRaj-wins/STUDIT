# Supabase setup (5 minutes)

1. **Create a project** at https://supabase.com/dashboard.
2. **Keys → `.env`** (Project Settings → API Keys):
   ```
   SUPABASE_URL=https://<project-ref>.supabase.co
   SUPABASE_PUBLISHABLE_KEY=sb_publishable_...   # or the legacy anon key
   ```
   Never paste the `service_role` / secret key: it would be exposed to the browser.
3. **Auth → Providers → Email**: enabled, keep **Confirm email** ON.
4. **Auth → URL Configuration**: Site URL `http://127.0.0.1:5000`, add `http://127.0.0.1:5000/login` to Redirect URLs.
5. **Only allow @bmsce.ac.in** (server-side, cannot be bypassed from the browser). In the SQL Editor run:
   ```sql
   create or replace function public.hook_bmsce_only(event jsonb)
   returns jsonb language plpgsql as $$
   begin
     if lower(split_part(event->'user'->>'email', '@', 2)) = 'bmsce.ac.in' then
       return '{}'::jsonb;
     end if;
     return jsonb_build_object('error', jsonb_build_object(
       'message', 'Only @bmsce.ac.in emails can join Studit.', 'http_code', 403));
   end $$;

   grant execute on function public.hook_bmsce_only to supabase_auth_admin;
   revoke execute on function public.hook_bmsce_only from authenticated, anon, public;
   ```
   Then **Auth → Hooks → Before User Created** → Postgres function `public.hook_bmsce_only`.
6. Restart `python app.py`, open http://127.0.0.1:5000/login.

The domain is checked three times: in the browser (instant feedback), by the Supabase hook (blocks sign-up),
and by Flask when it verifies the access token (`/api/auth/session`) before setting the session cookie.
