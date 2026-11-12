"""
Evidentia — Root App Main Proxy
Delegates directly to backend.app.main:app
"""
import os
import sys

_root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_backend_dir = os.path.join(_root_dir, "backend")

if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

from backend.app.main import app  # noqa: F401, E402

__all__ = ["app"]

