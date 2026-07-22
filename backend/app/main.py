from fastapi import FastAPI,HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from app.db.session import engine

app = FastAPI(
    title="AI Grading API",
    version = "0.1.0"
)


# 检查后端进程是否正常响应
@app.get("/api/v1/health", tags=["Health Check"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}

@app.get("/api/v1/ready", tags=["Health Check"])
def readiness_check() -> dict[str,str]:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except SQLAlchemyError as error:
        raise HTTPException(
            status_code = 503,
            detail="Database is unavailable",
            ) from error
    return {"status": "ready"}
