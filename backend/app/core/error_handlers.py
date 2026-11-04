import uuid
import logging
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("disputemind.security")


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Item 14: Hide error messages from users.
    Logs the full stack trace securely on the server with a unique error reference ID,
    while returning a completely sanitized, non-leaking error response to the client.
    """
    ref_id = str(uuid.uuid4())
    logger.error(
        f"[REF_ID: {ref_id}] Unhandled error at {request.method} {request.url.path}: {str(exc)}",
        exc_info=True
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal Server Error",
            "message": "An unexpected error occurred while processing your request. Please contact support with this reference ID.",
            "reference_id": ref_id
        }
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """
    Clean, predictable format for intentional HTTP exceptions (401, 403, 404, 429).
    """
    return JSONResponse(
        status_code=exc.status_code,
        headers=getattr(exc, "headers", None),
        content={
            "success": False,
            "error": exc.detail if isinstance(exc.detail, str) else "Request failed",
            "status_code": exc.status_code
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """
    Item 6: Check every form — sanitize validation errors.
    Returns clean field-level error messages without exposing internal code or stack traces.
    """
    clean_errors = []
    for err in exc.errors():
        field_loc = " -> ".join([str(loc) for loc in err.get("loc", []) if loc != "body"])
        clean_errors.append({
            "field": field_loc or "body",
            "message": err.get("msg", "Invalid input value"),
            "type": err.get("type", "value_error")
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Validation Error",
            "message": "One or more input fields failed validation.",
            "details": clean_errors
        }
    )

