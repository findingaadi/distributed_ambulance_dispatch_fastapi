from fastapi import HTTPException, Depends
from database import get_db
from models import User
from routes.auth import sessions  # Import the sessions dictionary from auth.py

def authenticate_user(token: str, db=Depends(get_db)):
    """
    Validates the session token and retrieves the authenticated user.
    """
    user_id = sessions.get(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user")

    return user  # Return the authenticated user object
