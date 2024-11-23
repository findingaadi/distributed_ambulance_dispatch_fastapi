#using a centralized session store due to inconsistent issues to session tracking
sessions = {}

def create_session(token, user_data):
    sessions[token] = user_data
    print(f"session created {sessions}")

def get_session(token):
    return sessions.get(token)

def delete_session(token):
    if token in sessions:
        del sessions[token]
        print(f"session deleted{sessions}")