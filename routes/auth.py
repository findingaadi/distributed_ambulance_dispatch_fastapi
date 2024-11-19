from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from database import get_db
from models import User
from utils import create_session  # Assume this generates a session token

router = APIRouter()

@router.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username.strip()).first()
    if not user or user.password != password.strip():
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"session_token": create_session(user.user_id), "role": user.role}
