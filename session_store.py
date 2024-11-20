# Centralized session store
sessions = {}

def create_session(token, user_data):
    sessions[token] = user_data
    print(f"Session created: {sessions}")  # Debugging log

def get_session(token):
    return sessions.get(token)

def delete_session(token):
    if token in sessions:
        del sessions[token]
        print(f"Session deleted: {sessions}")  # Debugging log
