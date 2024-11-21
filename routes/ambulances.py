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
    # Fetch the assignment
    assignment = db.query(Assignment).filter(Assignment.ambulance_id == user["username"],Assignment.status != "completed", Assignment.status != "received_patient").first()
    if not assignment:
        raise HTTPException(status_code=404, detail="No assignment found for this ambulance")

    # Fetch patient and hospital details
    patient = db.query(Patient).filter(Patient.nhs_number == assignment.nhs_number).first()
    hospital = db.query(Hospital).filter(Hospital.hospital_id == assignment.hospital_id).first()

    # Construct response
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

    print("Response to be sent to frontend:", response)  # Log the response for debugging
    return response

from fastapi import Form

@router.post("/add-notes")
def add_notes(
    notes: str = Form(...),  # Use simple string input via Form
    user=Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    if user["role"] != "ambulance":
        raise HTTPException(status_code=403, detail="Unauthorized access")

    # Fetch the assignment for the user's ambulance ID
    assignment = db.query(Assignment).filter(Assignment.ambulance_id == user["username"]).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="No assignment found for this ambulance")

    if not notes.strip():
        raise HTTPException(status_code=400, detail="Notes cannot be empty")

    # Append notes to the call details
    assignment.call_details += f"\nAmbulance Notes: {notes}"
    assignment.status = "notes_added"
    db.commit()

    return {"message": "Notes added successfully"}

