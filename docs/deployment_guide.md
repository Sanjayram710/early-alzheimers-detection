# Production Deployment Guide

## 1. Local Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- Virtual Environment

```bash
# Clone & Navigate
cd alzheimers-ai

# Backend Setup
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Seed Database
python scripts/seed_db.py

# Run FastAPI Backend
uvicorn backend.main:app --reload --port 8000

# Frontend Setup (in separate terminal)
cd frontend
npm install
npm run dev
```

## 2. Docker Compose Deployment

```bash
cd docker
docker-compose up --build -d
```
Access points:
- Frontend Web UI: `http://localhost:3000`
- FastAPI REST Docs: `http://localhost:8000/docs`

## 3. Cloud Deployment Strategy

### Backend Deployment (Render / AWS App Runner)
- Build Docker image from `docker/Dockerfile.backend`.
- Set Environment Variables:
  - `DATABASE_URL=postgresql://user:pass@host:5432/dbname`
  - `SECRET_KEY=production_secret_key_32_bytes_min`
  - `APP_ENV=production`

### Frontend Deployment (Vercel / Netlify)
- Deploy `frontend/` directory.
- Set Environment Variable `VITE_API_BASE_URL=https://your-backend-api.render.com/api/v1`.
