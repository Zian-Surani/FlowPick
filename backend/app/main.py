"""FlowPick — Adaptive Warehouse Learning Agent Backend Application."""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("flowpick")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown lifecycle management."""
    logger.info("Initializing FlowPick Q-Learning Warehouse Agent Backend...")
    yield
    logger.info("Shutting down FlowPick Backend.")


app = FastAPI(
    title="FlowPick API",
    description="Backend API for FlowPick Adaptive Warehouse Learning Agent (Q-Learning)",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration for Vite frontend local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(router)


@app.get("/")
def root():
    return {
        "project": "FlowPick — Adaptive Warehouse Learning Agent",
        "status": "online",
        "docs": "/docs",
    }
