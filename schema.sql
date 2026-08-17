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

-- Submission throttling. `bucket` is a SHA-256 of the submitter's IP, so no raw
-- IP address is ever stored; `window_start` is a unix epoch in seconds.
-- Safe to run against an existing database — both statements are IF NOT EXISTS.
CREATE TABLE IF NOT EXISTS rate_limit (
    bucket       TEXT PRIMARY KEY,
    hits         INTEGER NOT NULL,
    window_start INTEGER NOT NULL
);
