import os
import sys

# Ensure project root is on sys.path for Vercel Python Serverless runtime
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from dev_server import PublimarcaHandler  # noqa: E402


class handler(PublimarcaHandler):
    """Vercel Serverless Function entrypoint handling /es, /en, /admin, and /api/*."""
    pass
