from starlette.types import ASGIApp, Receive, Scope, Send
from starlette.datastructures import Headers, MutableHeaders
from app.config import settings


class SecurityHeadersMiddleware:
    """
    Item 8: Enforces HTTPS everywhere and attaches enterprise security headers to every response.
    """

    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        headers = Headers(scope=scope)

        # Item 8: In production, enforce HTTPS via X-Forwarded-Proto header (standard for Render/AWS)
        if settings.is_production:
            proto = headers.get("x-forwarded-proto", scope.get("scheme", "http"))
            if proto != "https":
                # Redirect to HTTPS
                host = headers.get("host", "localhost")
                path = scope.get("path", "/")
                query = scope.get("query_string", b"").decode("utf-8")
                url = f"https://{host}{path}"
                if query:
                    url += f"?{query}"

                async def redirect_send(message):
                    if message["type"] == "http.response.start":
                        message["status"] = 301
                        headers_list = list(message.get("headers", []))
                        headers_list.append((b"location", url.encode("utf-8")))
                        headers_list.append((b"strict-transport-security", b"max-age=31536000; includeSubDomains; preload"))
                        message["headers"] = headers_list
                    await send(message)

                await send({
                    "type": "http.response.start",
                    "status": 301,
                    "headers": [
                        (b"location", url.encode("utf-8")),
                        (b"strict-transport-security", b"max-age=31536000; includeSubDomains; preload")
                    ]
                })
                await send({"type": "http.response.body", "body": b""})
                return

        async def send_with_security_headers(message):
            if message["type"] == "http.response.start":
                res_headers = MutableHeaders(scope=message)

                # Strict Transport Security (HSTS) - 1 year preload
                res_headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
                # Prevent MIME-sniffing
                res_headers["X-Content-Type-Options"] = "nosniff"
                # Prevent clickjacking
                res_headers["X-Frame-Options"] = "DENY"
                # Cross-site scripting filter
                res_headers["X-XSS-Protection"] = "1; mode=block"
                # Content Security Policy (Item 8)
                res_headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"
                # Referrer Policy
                res_headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
                # Permissions Policy (restrict sensitive hardware access)
                res_headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=()"

            await send(message)

        await self.app(scope, receive, send_with_security_headers)

