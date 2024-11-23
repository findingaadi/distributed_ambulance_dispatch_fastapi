from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from utils import authenticate_user
from models import Assignment, Patient, Hospital
from pydantic import BaseModel

router = APIRouter()

@router.get("/view-assignment")
def view_assignment(
    user=Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    #get the assignment
    assignment = db.query(Assignment).filter(Assignment.ambulance_id == user["username"],Assignment.status != "completed", Assignment.status != "Patient arrived at hospital").first()
    if not assignment:
        raise HTTPException(status_code=404, detail="No assignment found for this ambulance")

    patient = db.query(Patient).filter(Patient.nhs_number == assignment.nhs_number).first()
    hospital = db.query(Hospital).filter(Hospital.hospital_id == assignment.hospital_id).first()

    response = {
        "patient_details": {
            "name": patient.name,
            "address": patient.address,
            "medical_history": patient.medical_history,
        },
        "hospital_details": {
            "name": hospital.name,
            "address": hospital.address,
        },
        "call_details": assignment.call_details,
    }

    return response

from fastapi import Form

@router.post("/add-notes")
def add_notes(
    notes: str = Form(...),
    user=Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    if user["role"] != "ambulance":
        raise HTTPException(status_code=403, detail="Unauthorized access")

    assignment = db.query(Assignment).filter(Assignment.ambulance_id == user["username"]).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="No assignment found for this ambulance")

    if not notes.strip():
        raise HTTPException(status_code=400, detail="Notes cannot be empty")

    #add notes from ambulance
    assignment.call_details += f"<br>Ambulance Notes: {notes},"
    assignment.status = "Ambulance notes added"
    db.commit()

    return {"message": "Ambulance notes added successfully"}

