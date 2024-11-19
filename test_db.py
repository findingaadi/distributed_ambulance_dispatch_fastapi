from sqlalchemy import create_engine

DATABASE_URL = "oracle+oracledb://system:system@localhost:1521/XE"

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute("SELECT 1 FROM DUAL")
        print("Connection successful:", result.fetchone())
except Exception as e:
    print("Connection failed:", str(e))
