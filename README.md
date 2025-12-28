# Requirements Document: Project Aloha - Phase 1 (Photo Sorter)

## 1. Introduction
This document defines the requirements for **Phase 1** of Project Aloha, a long-term Home AI initiative. Phase 1 focuses on developing a "Photo Sorter" application running on a high-end desktop. The primary goal is to build a high-quality, tagged, and portable database of personal photos that can later be consumed by low-power devices (like Raspberry Pi) for smart slideshows.

> **Note**: For the detailed execution strategy, please refer to the [Implementation Plan](./implementation_plan.md).

## 2. Project Scope
The application is a desktop-based tool designed to:
- Ingest photos from local storage.
- Analyze photos using local AI models (Face Recognition, Object Detection).
- allow users to query photos using Natural Language.
- Provide a rich UI for verifying, correcting, and enhancing photo tags.
- Output a portable database file containing file paths and metadata.

### 2.1 Out of Scope (Phase 1)
- **Voice Interaction**: Voice commands and speech-to-text processing are explicitly excluded from this phase.
- **Cloud Sync**: No cloud storage or synchronization features.

## 3. Component Architecture (High Level)
1.  **Ingestion Engine**: Scans folders, extracts metadata (Exif), and registers files.
2.  **AI Analysis Module**: Runs local models to identify faces and objects/scenes (auto-tagging).
3.  **Database**: Portable SQL-based storage (e.g., SQLite) to hold paths, tags, faces, and embeddings.
4.  **Query Engine**: Translates Natural Language input into database queries.
5.  **User Interface**: Dashboard for querying, viewing results, and bulk-editing tags.

## 4. Functional Requirements

### 4.1 Photo Ingestion
*   **FR-01**: User shall be able to add multiple local directory paths to be scanned.
*   **FR-02**: System shall index valid image files (JPG, PNG, etc.) and extract standard metadata (Date, Location, Resolution, Camera Model) as default tags.
*   **FR-03**: **Duplicate Management**:
    *   **FR-03.1 (Detection)**: System shall identify duplicate photos (binary exact or visually identical).
    *   **FR-03.2 (Tagging)**: When a duplicate is found, it shall be tagged as `duplicate` and include a reference (link/ID) to the "Primary" photo.
    *   **FR-03.3 (Search)**: User shall be able to specifically search/filter for "duplicate" photos.
    *   **FR-03.4 (Resolution)**: System shall provide a bulk-process capability to list duplicates for a given primary photo (or all duplicates) and allow easy deletion.
    *   **FR-03.5 (Cleanup)**: Upon deletion of duplicate files, the system shall automatically remove the corresponding `duplicate` tags and references.

### 4.2 Face Recognition & Identity Management
*   **FR-04**: System shall detect faces in ingested photos.
*   **FR-05**: System shall maintain a central dictionary of "Known Faces" (Person Name <-> Face Embeddings).
*   **FR-06**: User shall be able to assign names to detected faces.
*   **FR-07**: System shall allow defining multiple face embeddings per person to improve accuracy over time.
*   **FR-08**: System shall provide a specific UI to list identified faces and allow the user to correct wrongful identifications (Merge identities, Rename, Delete).

### 4.3 Tagging System
*   **FR-09**: System shall support three types of tags:
    *   **Immutable Tags**: Extracted from file (Date, Time, Resolution).
    *   **AI Tags**: Suggested by the system (Objects, Scenes, Faces).
    *   **User Tags**: Manually added custom keywords.
*   **FR-10**: Tags can be multi-valued (e.g., multiple faces in one photo), except for unique constraints like "Date Taken".
*   **FR-11**: **Auto-Tagging**: System shall propose tags based on image content analysis (e.g., "Beach", "Birthday", "Night").
*   **FR-12**: **Bulk Editing**: User shall be able to select multiple photos and Add/Remove/Modify tags in a single operation.
*   **FR-13**: User shall be able to view a master list of all tags used in the database.

### 4.4 Search & Retrieval (Natural Language Query)
*   **FR-14**: User shall be able to input queries in natural language (e.g., *"Show me photos of Dad and Mom in Hawaii from 2018"*).
*   **FR-15**: System shall translate NL input into a structured database query (SQL or similar).
*   **FR-16**: System shall execute the query and return a result set of photos.
*   **FR-17**: The result view shall allow immediate interaction for retagging (refining search results).

### 4.5 User Interface (UI)
*   **FR-18**: **Query Interface**: A search bar accepting text input.
*   **FR-19**: **Result Grid**: Display thumbnails of retrieved photos.
*   **FR-20**: **Detail/Inspector View**: When a photo is selected, show all current tags (faces, objects, dates).
*   **FR-21**: **Tag Editor**: Allow adding new tags, approving AI suggestions, or correcting wrong tags.
*   **FR-22**: **Face Manager**: A dedicated view to see clusters of faces and assign/fix names.

## 5. Non-Functional Requirements
*   **NFR-01**: **Performance**: Use local high-end GPU/CPU for inference; UI must remain responsive during background processing.
*   **NFR-02**: **Portability**: The resulting database must be self-contained (e.g., a single `.db` file) to be easily copied to a Raspberry Pi.
*   **NFR-03**: **Privacy**: All processing is local; no photos are uploaded to the cloud.
*   **NFR-04**: **Scalability**: Should handle libraries of 10,000+ photos efficiently.

## 6. Data Model Concepts
*   `Photo`: ID, Path, Hash.
*   `Tag`: ID, Category (Face, Object, Date), Value.
*   `Photo_Tag`: Mapping Photos to Tags.
*   `Person`: ID, Name, Representative Face Image.

## 7. Future Phases (FYI)
*   Deploy database to Raspberry Pi for voice-activated slideshows.
