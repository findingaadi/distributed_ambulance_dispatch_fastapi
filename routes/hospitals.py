from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from utils import authenticate_user
from models import Assignment, Patient, Ambulance

router = APIRouter()

@router.get("/view-assignments")
def view_assignments(
    user=Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    if user["role"] != "hospital":
        raise HTTPException(status_code=403, detail="Unauthorized access")

    assignments = db.query(Assignment).filter(
        Assignment.hospital_id == user["username"],
        Assignment.status != "completed"
    ).all()

    result = []
    for assignment in assignments:
        patient = db.query(Patient).filter(Patient.nhs_number == assignment.nhs_number).first()
        if not patient:
            continue

        result.append({
            "assignment_id": assignment.assignment_id,
            "patient_details": {
                "name": patient.name,
                "address": patient.address,
                "medical_history": patient.medical_history
            },
            "ambulance_id": assignment.ambulance_id,
            "call_details": assignment.call_details,
            "status": assignment.status,
        })
    return result


from fastapi import Form

@router.post("/update-assignment")
def update_assignment(
    assignment_id: int = Form(...),
    call_details: str = Form(None),
    status: str = Form(...),
    user=Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    try:
        if user["role"] != "hospital":
            raise HTTPException(status_code=403, detail="Unauthorized access")

        assignment = db.query(Assignment).filter(
            Assignment.assignment_id == assignment_id,
            Assignment.hospital_id == user["username"]
        ).first()

        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")

        if call_details:
            assignment.call_details += f"<br>Hospital Notes: {call_details}"

        #update status
        if status == "Patient arrived at hospital":
            assignment.status = status
            #change ambulance to available
            ambulance = db.query(Ambulance).filter(Ambulance.ambulance_id == assignment.ambulance_id).first()
            if ambulance:
                ambulance.status = "available"
        elif status == "completed":
            assignment.status = status

        db.commit()
        print("Assignment updated successfully")
        return {"message": "Assignment updated successfully"}
    except Exception as e:
        print(f"Error in update_assignment: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
