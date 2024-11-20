from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Assignment, Ambulance
from utils import authenticate_user
router = APIRouter()


@router.get("/view-assignment")
def view_assignment(
    ambulance_id: int,
    db: Session = Depends(get_db),
    user = Depends(authenticate_user)  # Require login
):
    if user.role != "ambulance":
        raise HTTPException(status_code=403, detail="Access forbidden for this role")

    assignment = db.query(Assignment).filter(
        Assignment.ambulance_id == ambulance_id, Assignment.status == "pending"
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="No assignment found")

    return {
        "patient_id": assignment.patient_id,
        "hospital_id": assignment.hospital_id,
        "call_details": assignment.call_details,
        "status": assignment.status
    }

VALID_STATUSES = ["available", "busy"]

@router.post("/update-status")
def update_status(ambulance_id: int, status: str, db: Session = Depends(get_db)):
    if status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status: {status}. Must be one of {VALID_STATUSES}.")
    
    ambulance = db.query(Ambulance).filter(Ambulance.ambulance_id == ambulance_id).first()
    if not ambulance:
        raise HTTPException(status_code=404, detail="Ambulance not found")

    # Update the ambulance status
    ambulance.status = status
    db.commit()
    db.refresh(ambulance)

    return {"message": "Ambulance status updated", "ambulance_id": ambulance.ambulance_id, "new_status": ambulance.status}
