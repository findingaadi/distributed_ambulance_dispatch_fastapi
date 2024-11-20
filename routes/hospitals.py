from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Assignment, Hospital
from utils import authenticate_user
router = APIRouter()


@router.get("/incoming-patients")
def incoming_patients(
    hospital_id: int,
    db: Session = Depends(get_db),
    user = Depends(authenticate_user)  # Require login
):
    if user.role != "hospital":
        raise HTTPException(status_code=403, detail="Access forbidden for this role")

    assignments = db.query(Assignment).filter(
        Assignment.hospital_id == hospital_id, Assignment.status == "pending"
    ).all()
    if not assignments:
        raise HTTPException(status_code=404, detail="No incoming patients found")

    return [
        {
            "assignment_id": a.assignment_id,
            "patient_id": a.patient_id,
            "ambulance_id": a.ambulance_id,
            "call_details": a.call_details,
            "status": a.status
        }
        for a in assignments
    ]


VALID_STATUSES = ["pending", "completed"]

@router.post("/update-assignment-status")
def update_assignment_status(assignment_id: int, status: str, db: Session = Depends(get_db)):
    if status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status: {status}. Must be one of {VALID_STATUSES}.")

    assignment = db.query(Assignment).filter(Assignment.assignment_id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Update the assignment status
    assignment.status = status
    db.commit()
    db.refresh(assignment)

    return {"message": "Assignment status updated", "assignment_id": assignment.assignment_id, "new_status": assignment.status}
