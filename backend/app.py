"""
Glow Salon & Spa — Starter demo backend (FastAPI).

A small FastAPI service that receives contact/enquiry form submissions from the
React frontend and stores them in a local SQLite database (enquiries.db).

No external services or credentials required — it runs fully offline.

Run:
    pip install -r requirements.txt
    python app.py
    #   ...or: uvicorn app:app --reload --port 5000
The API then listens on http://localhost:5000
Interactive docs at http://localhost:5000/docs
"""

import os
import re
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Optional

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "enquiries.db")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

app = FastAPI(title="Glow Salon & Spa API", version="1.0.0")

# Allow the React dev server / any origin for this demo.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS enquiries (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                name       TEXT    NOT NULL,
                email      TEXT,
                phone      TEXT    NOT NULL,
                service    TEXT,
                message    TEXT    NOT NULL,
                created_at TEXT    NOT NULL
            )
            """
        )
        conn.commit()


class ContactIn(BaseModel):
    name: str = ""
    email: str = ""
    phone: str = ""
    service: str = ""
    message: str = ""


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


@app.on_event("startup")
def _startup():
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "glow-salon-spa", "time": _now()}


@app.post("/api/contact")
def contact(payload: ContactIn):
    name = payload.name.strip()
    email = payload.email.strip()
    phone = payload.phone.strip()
    service = payload.service.strip()
    message = payload.message.strip()

    errors = {}
    if not name:
        errors["name"] = "Please enter your name."
    if not phone:
        errors["phone"] = "Please enter a phone number."
    elif len(re.sub(r"\D", "", phone)) < 7:
        errors["phone"] = "Please enter a valid phone number."
    if email and not EMAIL_RE.match(email):
        errors["email"] = "Please enter a valid email address."
    if not message:
        errors["message"] = "Please tell us how we can help."

    if errors:
        return JSONResponse(status_code=400, content={"ok": False, "errors": errors})

    created_at = _now()
    with get_db() as conn:
        cur = conn.execute(
            """INSERT INTO enquiries (name, email, phone, service, message, created_at)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (name, email, phone, service, message, created_at),
        )
        conn.commit()
        enquiry_id = cur.lastrowid

    return JSONResponse(
        status_code=201,
        content={
            "ok": True,
            "id": enquiry_id,
            "message": "Thanks! We've received your enquiry and will get back to you shortly.",
        },
    )


@app.get("/api/enquiries")
def list_enquiries():
    """Simple listing endpoint for the demo (view captured leads)."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM enquiries ORDER BY id DESC LIMIT 200"
        ).fetchall()
    return {"count": len(rows), "enquiries": [dict(r) for r in rows]}


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
