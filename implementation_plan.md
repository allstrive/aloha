# Implementation Plan - Project Aloha (Phase 1)

## Goal Description
To build a robust, desktop-based Photo Sorter application that ingests local photos, detects duplicates, applies AI-based tagging (faces, objects), and enables natural language search. The final output is a portable database.

## User Review Required
> [!IMPORTANT]
> Please review the proposed **Technology Stack** and **Staging Order** below.
> - **Backend**: Python (FastAPI/Flask) or Node.js? (Python recommended for AI libraries).
> - **Database**: SQLite (for portability requirement).
> - **Frontend**: React/Next.js or Electron? (Electron + React recommended for desktop app feel).

## Implementation Stages

### Stage 1: UI Mockup (Visual Reference)
**Goal**: Create a static visual representation of the application to align on design expectations.
- Create a `./mockup` folder.
- Design HTML/CSS/JS wireframes for:
    - Main Dashboard (Query Bar + Result Grid).
    - Detail View (Photo Inspector).
    - Duplicate Manager.
- **Deliverable**: Static HTML files in `mockup` folder demonstrating the intended look and feel.

### Stage 2: Foundation & Data Layer
**Goal**: Establish the project structure and persistent storage.
- Setup project repository (Monorepo vs Split).
- Define `SQLite` schema (Photos, Tags, Faces, Persons).
- Implement Database Access Logic (ORM or raw SQL queries).
- **Deliverable**: A runnable script that creates the empty `.db` file with correct tables.

### Stage 3: Ingestion & Duplicate Management (Core Logic)
**Goal**: Handle file operations and metadata extraction.
- Implement file scanner (recursive directory walk).
- Extract Exif metadata (Date, Camera, GPS).
- **Duplicate Detection**: Implement hash calculation (SHA256) and "visual hash" logic.
- Implement "Tag Duplicate" logic.
- **Deliverable**: CLI tool that scans a folder, populates DB, and flags duplicates.

### Stage 4: AI Pipeline Integration
**Goal**: Enable smart tagging capabilities.
- Integrate Face Detection library (e.g., `face_recognition`, `InsightFace`).
- Integrate Object/Scene detection (e.g., `YOLO`, `CLIP` or specialized/smaller models for efficiency).
- Implement "Auto-Tagger" service that updates valid photo records.
- **Deliverable**: CLI tool that takes a photo path and outputs detected tags/faces.

### Stage 5: API & Semantic Search Layer
**Goal**: Connect the data to a consumable API and enable NL search.
- Build REST/GraphQL API endpoints (List Photos, Get Details, Update Tags).
- Implement **NL-to-Query Engine** (Simple regex/heuristics or LLM-based translation to SQL).
- **Deliverable**: Running API server where a text query returns JSON photo results.

### Stage 6: User Interface (Frontend - Implementation)
**Goal**: Visual interaction for the user.
- **Photo Grid**: Display thumbnails with lazy loading.
- **Search Bar**: Input for Natural Language queries.
- **Inspector/Editor**: Side panel to view/edit tags and merge faces.
- **Duplicate Manager**: Specific view to review/delete duplicates.
- **Deliverable**: Functional UI connected to the Stage 4 API.

### Stage 7: Polish & Packaging
**Goal**: Ready for end-user (Phase 1 completion).
- Performance tuning (Batch insertion, Indexing).
- Portable DB export verification.
- Packaging as a desktop executable (if using Electron/PyInstaller).

## Verification Plan
### Automated Tests
- Unit tests for Ingestion logic (duplicate detection cases).
- API integration tests (NL query -> Expected SQL).

### Manual Verification
- Run ingestion on a sample "Test Dataset" (mix of duplicates, people, scenery).
- Verify "Dad at beach" query returns correct results in UI.
