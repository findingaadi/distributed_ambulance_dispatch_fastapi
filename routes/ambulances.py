from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from utils import authenticate_user
from models import Assignment, Patient

router = APIRouter()

@router.get("/view-assignment")
def view_assignment(
    user=Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    if user["role"] != "ambulance":
        raise HTTPException(status_code=403, detail="Unauthorized access")

    # Fetch the assignment for the user's ambulance ID
    assignment = db.query(Assignment).filter(Assignment.ambulance_id == user["username"]).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="No assignment found for this ambulance")

    patient = db.query(Patient).filter(Patient.patient_id == assignment.patient_id).first()

    return {
        "name": patient.name,
        "address": patient.address,
        "medical_history": patient.medical_history,
    }

@router.post("/add-notes")
def add_notes(
    notes: str,
    user=Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    if user["role"] != "ambulance":
        raise HTTPException(status_code=403, detail="Unauthorized access")

    # Fetch the assignment for the user's ambulance ID
    assignment = db.query(Assignment).filter(Assignment.ambulance_id == user["username"]).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="No assignment found for this ambulance")

    # Append notes to the assignment
    assignment.status = "notes_added"
    assignment.notes = notes  # Assuming 'notes' column exists
    db.commit()
    return {"message": "Notes added successfully"}
