"""PostToolUse hook: catch Python and Jinja syntax errors the moment a file is written.
Exit code 2 sends the error back to Claude so it fixes it immediately."""
import json, sys, py_compile

try:
    data = json.load(sys.stdin)
except Exception:
    sys.exit(0)

path = (data.get("tool_input") or {}).get("file_path", "")

if path.endswith(".py"):
    try:
        py_compile.compile(path, doraise=True)
    except py_compile.PyCompileError as e:
        print(f"Python syntax error in {path}:\n{e.msg}\nFix it before continuing.", file=sys.stderr)
        sys.exit(2)

elif path.endswith(".html"):
    try:
        import jinja2
        with open(path, encoding="utf-8") as f:
            jinja2.Environment().parse(f.read())
    except ImportError:
        pass
    except jinja2.TemplateSyntaxError as e:
        print(f"Jinja syntax error in {path} line {e.lineno}: {e.message}", file=sys.stderr)
        sys.exit(2)
    except Exception:
        pass

sys.exit(0)
