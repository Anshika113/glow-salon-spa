-- Glow Salon & Spa — D1 schema (mirrors backend/app.py)

CREATE TABLE IF NOT EXISTS enquiries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT,
    phone      TEXT NOT NULL,
    service    TEXT,
    message    TEXT NOT NULL,
    created_at TEXT NOT NULL
);
