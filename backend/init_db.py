import sqlite3
import os

# DB is mounted at /app/aloha.db in Docker
DB_PATH = "aloha.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL UNIQUE,
    hash TEXT,
    date_taken TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    category TEXT -- 'face', 'object', 'scene', 'custom'
);

CREATE TABLE IF NOT EXISTS photo_tags (
    photo_id INTEGER,
    tag_id INTEGER,
    confidence REAL DEFAULT 1.0,
    source TEXT DEFAULT 'ai' CHECK(source IN ('user', 'ai')),
    box_json TEXT, -- JSON string for bounding box {x, y, w, h}
    PRIMARY KEY (photo_id, tag_id),
    FOREIGN KEY(photo_id) REFERENCES photos(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id)
);

CREATE TABLE IF NOT EXISTS persons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    cover_photo_id INTEGER,
    FOREIGN KEY(cover_photo_id) REFERENCES photos(id)
);

-- Faces table to link specific face detections to persons
CREATE TABLE IF NOT EXISTS faces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    photo_id INTEGER,
    person_id INTEGER,
    encoding BLOB, -- To store face embedding
    box_json TEXT,
    source TEXT DEFAULT 'ai' CHECK(source IN ('user', 'ai')),
    FOREIGN KEY(photo_id) REFERENCES photos(id),
    FOREIGN KEY(person_id) REFERENCES persons(id)
);
"""

def init_db(db_path=DB_PATH):
    # In Docker, we are in /app, so 'aloha.db' refers to /app/aloha.db which maps to host aloha.db
    if os.path.exists(db_path):
        print(f"Database {db_path} already exists.")
    else:
        print(f"Creating database at {db_path}")

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.executescript(SCHEMA)
    conn.commit()
    conn.close()
    print("Database initialized successfully.")

if __name__ == "__main__":
    init_db()
