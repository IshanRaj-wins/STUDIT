"""Stop hook: before Claude says 'done', import the Flask app and hit key routes.
Any 500 or crash is sent back to Claude (exit 2) so it keeps fixing.
stop_hook_active prevents infinite loops."""
import json, os, sys, traceback

try:
    data = json.load(sys.stdin)
except Exception:
    data = {}
if data.get("stop_hook_active"):
    sys.exit(0)

root = os.environ.get("CLAUDE_PROJECT_DIR", os.getcwd())
if not os.path.exists(os.path.join(root, "app.py")):
    sys.exit(0)

os.chdir(root)
sys.path.insert(0, root)
try:
    import app as module
    flask_app = getattr(module, "app", None)
    if flask_app is None:
        sys.exit(0)
    client = flask_app.test_client()
    failures = []
    for route in ["/", "/browse", "/login", "/dashboard", "/ask", "/add", "/requests", "/api/resources", "/resource/1"]:
        r = client.get(route)
        if r.status_code >= 500:
            failures.append(f"{route} -> {r.status_code}")
    if failures:
        print("Smoke test FAILED (server errors):\n" + "\n".join(failures) +
              "\nFix these before finishing.", file=sys.stderr)
        sys.exit(2)
except SystemExit:
    raise
except ModuleNotFoundError as e:
    # Hook's python lacks deps (e.g. Claude used a venv) - don't block, just warn
    print(f"Smoke test skipped: {e}", file=sys.stderr)
    sys.exit(0)
except Exception:
    print("Smoke test crashed while importing/running app.py:\n" + traceback.format_exc(limit=3),
          file=sys.stderr)
    sys.exit(2)
sys.exit(0)
