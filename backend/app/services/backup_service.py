import os
import glob
import time
import sqlite3
import asyncio
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any
from app.config import settings

logger = logging.getLogger("disputemind.backup")


class BackupService:
    """
    Item 11: Backup database everyday — Daily automated backups and retention management.
    """

    def __init__(self, backup_dir: str = settings.BACKUP_DIR, retention_days: int = settings.BACKUP_RETENTION_DAYS):
        self.backup_dir = backup_dir
        self.retention_days = retention_days
        os.makedirs(self.backup_dir, exist_ok=True)

    def _get_sqlite_source_path(self) -> str:
        if settings.DATABASE_URL.startswith("sqlite:///"):
            return settings.DATABASE_URL.replace("sqlite:///", "")
        return "disputemind.db"

    def create_backup(self) -> Dict[str, Any]:
        """
        Creates an online, non-blocking snapshot using SQLite's native backup API.
        Item 10: Ensures database integrity without corrupting open transactions.
        """
        source_path = self._get_sqlite_source_path()
        if not os.path.exists(source_path):
            logger.warning(f"Database file {source_path} does not exist yet; creating empty placeholder.")
            return {"success": False, "message": "Source database file does not exist yet."}

        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        backup_filename = f"disputemind_backup_{timestamp}.db"
        backup_path = os.path.join(self.backup_dir, backup_filename)

        try:
            # Connect to source and target using sqlite3
            src_conn = sqlite3.connect(source_path)
            dst_conn = sqlite3.connect(backup_path)

            with dst_conn:
                src_conn.backup(dst_conn, pages=100, sleep=0.01)

            dst_conn.close()
            src_conn.close()

            # Set safe file permissions on backup (owner only)
            try:
                os.chmod(backup_path, 0o600)
            except Exception:
                pass

            file_size_bytes = os.path.getsize(backup_path)
            logger.info(f"[BACKUP] Successfully created daily snapshot: {backup_filename} ({file_size_bytes} bytes)")

            # Auto-prune old backups exceeding retention limit
            pruned_count = self.prune_old_backups()

            return {
                "success": True,
                "filename": backup_filename,
                "path": backup_path,
                "size_bytes": file_size_bytes,
                "timestamp": timestamp,
                "pruned_backups": pruned_count
            }
        except Exception as e:
            logger.error(f"[BACKUP ERROR] Failed to create database snapshot: {str(e)}", exc_info=True)
            return {"success": False, "error": str(e)}

    def prune_old_backups(self) -> int:
        """
        Item 11: Prunes backups older than BACKUP_RETENTION_DAYS to prevent disk exhaustion.
        """
        cutoff_time = time.time() - (self.retention_days * 86400)
        pruned = 0

        pattern = os.path.join(self.backup_dir, "disputemind_backup_*.db")
        for filepath in glob.glob(pattern):
            try:
                if os.path.getmtime(filepath) < cutoff_time:
                    os.remove(filepath)
                    pruned += 1
                    logger.info(f"[BACKUP PRUNE] Removed expired backup: {os.path.basename(filepath)}")
            except Exception as e:
                logger.error(f"Failed to prune backup file {filepath}: {e}")

        return pruned

    def list_backups(self) -> List[Dict[str, Any]]:
        """List all available backup snapshots with size and modification date."""
        pattern = os.path.join(self.backup_dir, "disputemind_backup_*.db")
        results = []
        for filepath in sorted(glob.glob(pattern), reverse=True):
            stat = os.stat(filepath)
            results.append({
                "filename": os.path.basename(filepath),
                "size_bytes": stat.st_size,
                "created_at": datetime.fromtimestamp(stat.st_mtime, timezone.utc).isoformat()
            })
        return results


backup_service = BackupService()


async def start_daily_backup_scheduler():
    """
    Background worker that runs a daily database backup every 24 hours.
    """
    logger.info("[SCHEDULER] Daily automated database backup scheduler started.")
    while True:
        try:
            # Create snapshot
            backup_service.create_backup()
        except Exception as e:
            logger.error(f"[SCHEDULER ERROR] Daily backup cycle encountered an error: {e}")
        # Sleep for 24 hours (86,400 seconds)
        await asyncio.sleep(86400)

