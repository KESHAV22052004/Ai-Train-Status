"""
database.py — SQLite database for alerts.

Uses the same schema as Supabase would, making migration trivial:
just swap this module for supabase-py calls.
"""

import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

DB_PATH = Path(__file__).parent / "alerts.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db() -> None:
    """Create alerts and users tables if they don't exist."""
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS alerts (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            train_query TEXT NOT NULL,
            condition TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    """)
    conn.commit()
    conn.close()


def create_user(email: str, password_hash: str) -> dict:
    """Insert a new user and return it."""
    user_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()
    conn = get_connection()
    try:
        conn.execute(
            "INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
            (user_id, email, password_hash, created_at),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise ValueError("Email already registered")
    
    conn.close()
    return {
        "id": user_id,
        "email": email,
        "created_at": created_at,
    }


def get_user_by_email(email: str) -> Optional[dict]:
    """Fetch a user by email."""
    conn = get_connection()
    row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    conn.close()
    return dict(row) if row else None


def create_alert(user_id: str, train_query: str, condition: str) -> dict:
    """Insert a new alert and return it."""
    alert_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    conn = get_connection()
    conn.execute(
        "INSERT INTO alerts (id, user_id, train_query, condition, created_at) VALUES (?, ?, ?, ?, ?)",
        (alert_id, user_id, train_query, condition, created_at),
    )
    conn.commit()
    conn.close()

    return {
        "id": alert_id,
        "user_id": user_id,
        "train_query": train_query,
        "condition": condition,
        "created_at": created_at,
    }


def get_alerts(user_id: Optional[str] = None) -> list[dict]:
    """Fetch all alerts, optionally filtered by user_id."""
    conn = get_connection()
    if user_id:
        rows = conn.execute(
            "SELECT * FROM alerts WHERE user_id = ? ORDER BY created_at DESC",
            (user_id,),
        ).fetchall()
    else:
        rows = conn.execute("SELECT * FROM alerts ORDER BY created_at DESC").fetchall()
    conn.close()
    return [dict(row) for row in rows]


def delete_alert(alert_id: str) -> bool:
    """Delete an alert by ID. Returns True if deleted."""
    conn = get_connection()
    cursor = conn.execute("DELETE FROM alerts WHERE id = ?", (alert_id,))
    conn.commit()
    conn.close()
    return cursor.rowcount > 0
