import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Set

logger = logging.getLogger("disputemind")


class LiveLogBroadcaster:
    """
    Broadcaster for streaming real-time pipeline events to the UI's Live Terminal via Server-Sent Events (SSE).
    """

    def __init__(self):
        self.subscribers: Set[asyncio.Queue] = set()

    async def subscribe(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self.subscribers.add(queue)
        return queue

    def unsubscribe(self, queue: asyncio.Queue) -> None:
        self.subscribers.discard(queue)

    async def broadcast(self, message: str, level: str = "INFO", meta: dict = None) -> None:
        """
        Broadcast an event to all connected UI clients.
        """
        timestamp = datetime.now(timezone.utc).strftime("%H:%M:%S")
        payload = {
            "timestamp": timestamp,
            "level": level,
            "message": message,
            "meta": meta or {}
        }
        json_data = json.dumps(payload)
        logger.info(f"[{level}] {message}")

        # Dispatch to all active SSE queues
        dead_queues = []
        for queue in list(self.subscribers):
            try:
                queue.put_nowait(json_data)
            except Exception:
                dead_queues.append(queue)

        for dead in dead_queues:
            self.subscribers.discard(dead)


broadcaster = LiveLogBroadcaster()
