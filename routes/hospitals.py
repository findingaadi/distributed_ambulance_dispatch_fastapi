from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from utils import authenticate_user
from models import Assignment, Patient

router = APIRouter()

@router.get("/view-assignments")
def view_assignments(
    user=Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    if user["role"] != "hospital":
        raise HTTPException(status_code=403, detail="Unauthorized access")

    assignments = db.query(Assignment).filter(Assignment.hospital_id == user["username"]).all()

    result = []
    for assignment in assignments:
        patient = db.query(Patient).filter(Patient.patient_id == assignment.patient_id).first()
        result.append({
            "assignment_id": assignment.assignment_id,
            "patient_name": patient.name,
            "ambulance_notes": assignment.status,  # Assuming notes are in status or separate column
        })
    return result

@router.post("/update-record")
def update_record(
    assignment_id: int,
    call_details: str,
    time_spent: int,
    user=Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    if user["role"] != "hospital":
        raise HTTPException(status_code=403, detail="Unauthorized access")

    assignment = db.query(Assignment).filter(Assignment.assignment_id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Update the assignment record
    assignment.call_details = call_details
    assignment.time_spent = time_spent  # Assuming `time_spent` column exists
    assignment.status = "record_updated"
    db.commit()

    return {"message": "Patient record updated successfully"}
