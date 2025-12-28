# Database Schema Documentation

This document describes the SQLite database structure for Project Aloha.

## Entity Relationship Diagram

```mermaid
erDiagram
    PHOTOS ||--o{ PHOTO_TAGS : "has"
    TAGS ||--o{ PHOTO_TAGS : "assigned_to"
    PHOTOS ||--o{ PERSONS : "used_as_cover"
    PHOTOS ||--o{ FACES : "contains"
    PERSONS ||--o{ FACES : "has_embeddings"

    PHOTOS {
        INTEGER id PK
        TEXT path UK "Unique file path"
        TEXT hash "File hash for de-duplication"
        TEXT date_taken "Exif timestamp"
        TIMESTAMP created_at
    }

    TAGS {
        INTEGER id PK
        TEXT name UK
        TEXT category "'face', 'object', 'scene', 'custom'"
    }

    PHOTO_TAGS {
        INTEGER photo_id PK, FK
        INTEGER tag_id PK, FK
        REAL confidence "Detection confidence 0.0-1.0"
        TEXT source "Origin: 'user' or 'ai'"
        TEXT box_json "Bounding box {x,y,w,h}"
    }

    PERSONS {
        INTEGER id PK
        TEXT name UK
        INTEGER cover_photo_id FK "Best photo for UI"
    }

    FACES {
        INTEGER id PK
        INTEGER photo_id FK
        INTEGER person_id FK
        BLOB encoding "Vector embedding"
        TEXT source "Origin: 'user' or 'ai'"
        TEXT box_json "Face location in photo"
    }
```

## Tables Description

### 1. `photos`
Stores the master list of all ingested images.
- **path**: Absolute path to the file. Must be unique.
- **hash**: SHA-256 (or similar) hash of the image content to detect duplicates.
- **date_taken**: Extracted from EXIF data.

### 2. `tags`
Central dictionary of all tags (objects, scenes, custom keywords).
- **category**: `object`, `scene`, `custom`, `face`.

### 3. `photo_tags`
Junction table linking Photos to Tags (Many-to-Many).
- **confidence**: AI confidence score.
- **source**: `'user'` (manual) or `'ai'` (auto).
- **box_json**: Region of interest.

### 4. `persons`
Represents unique individuals.
- **name**: Person's name.

### 5. `faces`
Specific face detections.
- **encoding**: Face embedding vector.
- **source**: `'user'` or `'ai'`.
- **person_id**: Link to `persons`.
