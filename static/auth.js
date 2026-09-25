// StudyVault auth: Supabase email + password, restricted to @bmsce.ac.in.
// The browser only holds the public publishable key; Flask re-verifies every token server-side.
(() => {
  const DOMAIN = "@bmsce.ac.in";
  const cfg = window.SV_AUTH;
  if (!cfg || !window.supabase) return;
  const fromLink = /access_token|code=|type=signup/.test(location.hash + location.search);  // read before supabase-js clears it
  const sb = window.supabase.createClient(cfg.url, cfg.key);
  window.svSupabase = sb;

  const $ = (s) => document.querySelector(s);
  const form = $("#auth-form");

  // Hand the Supabase session to Flask, which checks the domain + confirmation and sets a cookie
  async function handoff(session) {
    const r = await fetch("/api/auth/session", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: session.access_token }) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { await sb.auth.signOut(); throw new Error(d.error || "Couldn't sign you in."); }
    location.href = cfg.next || "/dashboard";
  }

  // Sign out everywhere (used by the dashboard)
  window.svSignOut = async () => {
    try { await sb.auth.signOut(); } catch {}
    await fetch("/api/auth/logout", { method: "POST" });
    location.href = "/";
  };

  if (!form) return;

  let mode = "signup";
  const msg = (text, kind = "err") => { const m = $("#msg"); m.textContent = text; m.className = `msg show ${kind}`; };
  const clearMsg = () => ($("#msg").className = "msg");
  const validEmail = (v) => /^[^\s@]+@bmsce\.ac\.in$/i.test(v.trim());

  // Returning from the confirmation link (or an existing Supabase session): hand it to Flask once
  let handed = false;
  sb.auth.onAuthStateChange((event, session) => {
    if (handed || !session || !["SIGNED_IN", "INITIAL_SESSION"].includes(event)) return;
    handed = true;
    setTimeout(() => {
      msg(fromLink ? "Email confirmed, signing you in…" : "Signing you in…", "ok");
      handoff(session).catch((e) => { handed = false; msg(e.message); });
    });
  });

  function setMode(m) {
    mode = m; clearMsg();
    document.querySelectorAll("[data-mode]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.mode === m)));
    $("#name-row").hidden = m !== "signup";
    $("#title").textContent = m === "signup" ? "Join the vault" : "Welcome back";
    $("#subtitle").textContent = m === "signup" ? "Use your college email. Takes 20 seconds." : "Sign in with your BMSCE account.";
    $("#password").autocomplete = m === "signup" ? "new-password" : "current-password";
    $("#submit").innerHTML = (m === "signup" ? "Create account" : "Sign in") + ' <span class="arrow">→</span>';
  }
  document.querySelectorAll("[data-mode]").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  $("#back-signin")?.addEventListener("click", () => { $("#sent").style.display = "none"; $("#form-wrap").style.display = ""; setMode("signin"); });

  // Live domain check
  const email = $("#email"), hint = $("#email-hint"), suffix = $("#suffix");
  email.addEventListener("input", () => {
    const v = email.value.trim();
    suffix.textContent = v && !v.includes("@") ? DOMAIN : "";
    const bad = v.includes("@") && !validEmail(v) && v.split("@")[1].length >= 3;
    email.classList.toggle("bad", bad);
    email.classList.toggle("good", validEmail(v));
    hint.textContent = bad ? `Only ${DOMAIN} emails can join StudyVault.` : validEmail(v) ? "✓ BMSCE email" : `Must end with ${DOMAIN}`;
    hint.classList.toggle("err", bad);
  });
  // Typing just the username auto-completes the domain on blur
  email.addEventListener("blur", () => { const v = email.value.trim(); if (v && !v.includes("@")) { email.value = v + DOMAIN; email.dispatchEvent(new Event("input")); } });

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); clearMsg();
    const addr = email.value.trim().toLowerCase(), pw = $("#password").value, name = $("#name").value.trim();
    if (!validEmail(addr)) { email.classList.add("bad"); return msg(`Only ${DOMAIN} emails can join StudyVault.`); }
    if (pw.length < 6) return msg("Password needs at least 6 characters.");
    if (mode === "signup" && name.length < 2) return msg("Tell us your name so your uploads get credit.");

    const btn = $("#submit"), label = btn.innerHTML;
    handed = true;  // this handler does the handoff itself
    btn.disabled = true; btn.innerHTML = `<span class="spin"></span> ${mode === "signup" ? "Creating account…" : "Signing in…"}`;
    try {
      if (mode === "signup") {
        const { data, error } = await sb.auth.signUp({ email: addr, password: pw,
          options: { data: { full_name: name }, emailRedirectTo: location.origin + "/login?next=" + encodeURIComponent(cfg.next || "/dashboard") } });
        if (error) throw error;
        if (data.session) return await handoff(data.session);        // email confirmation disabled
        if (data.user && !data.user.identities?.length) throw new Error("That email is already registered. Sign in instead.");
        $("#sent-to").textContent = addr; $("#form-wrap").style.display = "none"; $("#sent").style.display = "block";
      } else {
        const { data, error } = await sb.auth.signInWithPassword({ email: addr, password: pw });
        if (error) throw error;
        await handoff(data.session);
      }
    } catch (err) {
      const t = String(err.message || err);
      msg(/not confirmed/i.test(t) ? "Confirm your email first. Check your college inbox (and spam)." :
          /invalid login/i.test(t) ? "Wrong email or password." : t);
      handed = false; btn.disabled = false; btn.innerHTML = label;
    }
  });
})();
