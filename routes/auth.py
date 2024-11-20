import secrets
from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from database import get_db
from models import User

router = APIRouter()

# Simulated session storage (use a database or Redis for production)
sessions = {}

@router.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    if not user or user.password != password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Generate a session token
    token = secrets.token_hex(16)
    sessions[token] = {"user_id": user.user_id, "role": user.role}

    return {"message": "Login successful", "session_token": token, "role": user.role}


@router.get("/logout")
def logout(token: str):
    if token in sessions:
        del sessions[token]
        return {"message": "Logout successful"}
    raise HTTPException(status_code=401, detail="Invalid token")
