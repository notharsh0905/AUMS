# File Storage Domain

## Purpose

The File Storage Domain manages all uploaded files within AUMS.

Files are stored in object storage (MinIO/S3).

Database stores metadata only.

---

## Responsibilities

* File Metadata Management
* File Versioning
* File Ownership Tracking
* File Access Control
* File Audit Integration

---

## Storage Architecture

User Upload
↓
MinIO Object Storage
↓
File Metadata Database
↓
Application Access

---

## Dependencies

Identity Domain

Audit Domain

All Functional Domains

Examples:

* Student Documents
* Assignments
* Assignment Submissions
* Certificates
* Profile Photos
* Transcripts
* Research Papers
* E-Office Attachments

---

## Tables

### storage_buckets

Logical storage containers.

Examples:

* students
* assignments
* transcripts
* certificates

---

### files

Master file metadata table.

Stores:

* filename
* object_key
* mime_type
* file_size
* uploaded_by
* bucket

---

### file_versions

Tracks file revisions.

Supports:

* Transcript Regeneration
* Document Updates
* Assignment Resubmission

---

### file_access_logs

Tracks file downloads and views.

Supports:

* Security Monitoring
* Compliance Reporting
* Audit Trails

---

## Security Considerations

* Files never stored in PostgreSQL.
* Object storage access controlled through application.
* Signed URLs for downloads.
* Sensitive documents encrypted.

---

## Future Features

* Virus Scanning
* OCR Extraction
* AI Document Analysis
* Content Deduplication

---

## Scalability Considerations

Supports:

* MinIO
* Amazon S3
* Azure Blob Storage
* Google Cloud Storage

without schema changes.
