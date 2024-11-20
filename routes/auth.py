from fastapi import APIRouter, Form, HTTPException, Depends
from sqlalchemy.orm import Session
from models import User
from database import get_db
import secrets
from session_store import create_session, delete_session

router = APIRouter()

@router.post("/login")
def login(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    # Check user credentials
    user = db.query(User).filter(User.username == username).first()
    if not user or user.password != password:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Generate a session token
    session_token = secrets.token_hex(16)
    create_session(session_token, {"username": user.username, "role": user.role})

    print(f"User {user.username} logged in with token {session_token}")
    return {"token": session_token, "role": user.role}


@router.get("/logout")
def logout(token: str):
    delete_session(token)
    return {"message": "Logged out successfully"}
