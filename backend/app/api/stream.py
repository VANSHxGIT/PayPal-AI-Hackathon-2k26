import asyncio
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.core.logger import broadcaster

router = APIRouter(prefix="/api/stream", tags=["Live Terminal Stream"])


@router.get(
    "/logs",
    summary="Real-time Server-Sent Events (SSE) stream for live demo visual terminal"
)
async def stream_logs():
    """
    Broadcasts real-time events from webhook receipt, Elastic queries, Gemini synthesis, and PayPal submission.
    """
    queue = await broadcaster.subscribe()

    async def event_generator():
        try:
            # Yield initial connection message
            yield "data: {\"timestamp\": \"SYS\", \"level\": \"INFO\", \"message\": \"[SYSTEM] Connected to Evidentia Live Event Stream\"}\n\n"
            while True:
                data = await queue.get()
                yield f"data: {data}\n\n"
        except asyncio.CancelledError:
            broadcaster.unsubscribe(queue)
        finally:
            broadcaster.unsubscribe(queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )

