"""
Evidentia — Root Package Proxy
Enables seamless execution of 'uvicorn app.main:app' from the repository root
by dynamically extending the package search path to 'backend/app'.
"""
import os
import sys

_root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_backend_dir = os.path.join(_root_dir, "backend")
_backend_app_dir = os.path.join(_backend_dir, "app")

if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

if _backend_app_dir not in __path__:
    __path__.insert(0, _backend_app_dir)

