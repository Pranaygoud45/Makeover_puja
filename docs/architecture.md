# Architecture

The platform is split into a React customer/admin frontend and a FastAPI backend.
The backend exposes versioned REST endpoints under `/api/v1`, owns business rules,
and persists data in PostgreSQL. Uploaded media should live in managed object
storage (S3 or Cloudinary), not on an ephemeral application filesystem.

## Production decisions
- Use managed PostgreSQL with automated backups and point-in-time recovery.
- Store secrets in the deployment platform's secret manager.
- Restrict CORS to known production origins.
- Add rate limiting, structured logs, monitoring and alerting.
- Use transactions and database constraints for appointment-slot integrity.
