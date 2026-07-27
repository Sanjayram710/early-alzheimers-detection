# System Architecture & Technical Specifications

## Overview
`alzheimers-ai` is an enterprise-grade research and clinical decision-support web application designed for early Alzheimer's disease detection from brain MRI scans using Deep Learning.

```
+-------------------------------------------------------------------------------+
|                                React Frontend (Vite)                          |
|    - Upload MRI Scan     - Interactive Grad-CAM      - Analytics Dashboard     |
+---------------------------------------+---------------------------------------+
                                        | REST API / JWT
                                        v
+-------------------------------------------------------------------------------+
|                                FastAPI Backend                                |
|    - Authentication & RBAC    - Storage Service       - Inference Engine    |
|    - ReportLab PDF Service    - Audit Logging         - SQLAlchemy ORM      |
+---------------------------------------+---------------------------------------+
                                        |
           +----------------------------+----------------------------+
           |                                                         |
           v                                                         v
+-----------------------+                               +-----------------------+
|  PostgreSQL / SQLite  |                               |    Keras / TF Model   |
|   (User, Predictions) |                               | (CNN, ResNet, ViT)    |
+-----------------------+                               +-----------------------+
```

## Technology Stack
- **Language**: Python 3.11+
- **Deep Learning**: TensorFlow 2.16+, Keras, OpenCV, NumPy, Scikit-Learn
- **Backend API**: FastAPI, Uvicorn, Pydantic V2, Pydantic-Settings
- **Database Layer**: SQLAlchemy 2.0 (Async), AsyncPG / AIOSQLite, Alembic
- **PDF Generation**: ReportLab
- **Security**: PyJWT, Passlib (Bcrypt), OAuth2 Bearer Token
- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide Icons
- **DevOps**: Docker, Docker Compose
