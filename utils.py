from fastapi import HTTPException, Header, Depends
from session_store import get_session

def get_current_token(authorization: str = Header(...)):
    # Extract token from Authorization header
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token format")
    token = authorization.split("Bearer ")[1]
    print(f"Authorization header received: {authorization}")
    print(f"Extracted token: {token}")
    return token

def authenticate_user(token: str = Depends(get_current_token)):
    # Validate session token
    session = get_session(token)
    if not session:
        print("Invalid or expired token!")
        raise HTTPException(status_code=401, detail="Unauthorized")
    print(f"Authenticated user: {session}")
    return session
