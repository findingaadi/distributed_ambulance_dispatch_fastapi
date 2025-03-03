from fastapi import FastAPI
from routes import auth, headquarters, ambulances, hospitals
from fastapi.staticfiles import StaticFiles
from routes import auth


app = FastAPI()

app.include_router(auth.router, prefix="/auth")
app.include_router(headquarters.router, prefix="/hq")
app.include_router(ambulances.router, prefix="/ambulances")
app.include_router(hospitals.router, prefix="/hospitals")
app.mount("/presentation", StaticFiles(directory="presentation"), name="presentation")
