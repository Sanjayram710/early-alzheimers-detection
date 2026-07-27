import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from backend.utils.config import settings
from backend.utils.logging import setup_logging
from backend.database.connection import init_db
from backend.api.router import api_router

# Initialize structured logger
setup_logging(debug=settings.DEBUG)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI Lifespan Context Manager handling DB table creation on startup."""
    # Create upload directories
    settings.get_upload_path()
    settings.get_reports_path()

    # Initialize DB
    await init_db()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Production-ready REST API for AI-Based Early Alzheimer's Disease Detection "
        "using Deep Learning and Brain MRI Images. Intended as a research and clinical decision support system."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router)

# Mount uploaded files static directory for image preview
upload_dir = settings.get_upload_path()
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")


# Root Health Check
@app.get("/", tags=["Health"])
async def root():
    return {
        "title": settings.APP_NAME,
        "status": "running",
        "docs": "/docs",
        "api_v1": "/api/v1"
    }


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": f"An internal server error occurred: {str(exc)}"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
