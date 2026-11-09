"""
DisputeMind AI — Root Entrypoint for Cloud Deployments (Render / Docker / Heroku)
Allows uvicorn to start the application directly from the repository root
(e.g., 'uvicorn main:app' or 'python -m uvicorn main:app').
"""
import os
import sys

# Ensure backend directory is in sys.path
_current_dir = os.path.dirname(os.path.abspath(__file__))
_backend_dir = os.path.join(_current_dir, "backend")

if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

from app.main import app  # noqa: E402, F401

__all__ = ["app"]

