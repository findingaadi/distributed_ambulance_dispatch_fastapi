import uuid

# Mock session store
SESSIONS = {}

def create_session(user_id):
    """Create a session and return the session token."""
    session_token = str(uuid.uuid4())
    SESSIONS[session_token] = user_id
    return session_token

def get_user_from_session(token):
    """Retrieve user ID from session token."""
    return SESSIONS.get(token)

def delete_session(token):
    """Delete a session."""
    if token in SESSIONS:
        del SESSIONS[token]
