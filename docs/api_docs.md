# REST API Documentation

Base URL: `/api/v1`

## Endpoints Summary

### Authentication (`/auth`)
- `POST /auth/register` - Register a new user (`user` or `admin`).
- `POST /auth/login` - OAuth2 form login returning JWT access token.
- `GET /auth/me` - Get profile details of logged-in user.

### Inference & Uploads (`/predict` / `/upload`)
- `POST /predict` or `POST /upload` - Upload MRI image file (multipart/form-data). Returns prediction probabilities, Grad-CAM base64 overlays, and disclaimer.

### History & Reports (`/history`, `/reports`)
- `GET /history` - List prediction history for user.
- `GET /history/{id}` - Retrieve details for specific prediction.
- `POST /reports/generate/{prediction_id}` - Generate PDF report.
- `GET /reports/{id}/download` - Download PDF report binary file.

### Dashboard & Admin (`/dashboard`, `/admin`)
- `GET /dashboard/stats` - Summary analytics, class counts, mean confidence.
- `GET /admin/users` - List system users (Admin only).
- `GET /admin/audit-logs` - View security audit logs (Admin only).
- `POST /models/activate/{version_name}` - Switch active model version (Admin only).
