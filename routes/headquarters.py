from fastapi import APIRouter,Depends,HTTPException,Form,Query
from sqlalchemy.orm import Session
from database import get_db
from utils import authenticate_user
from models import Patient, Ambulance, Hospital, Assignment, User


router = APIRouter()

@router.get("/search-patient")
def search_patient(
    nhs_number: str,
    db: Session = Depends(get_db),
    user = Depends(authenticate_user)
):
    print(f"Authenticated user: {user['username']}, Role: {user['role']}")

    #role checker
    if user["role"] != "headquarter":
        raise HTTPException(status_code=403, detail="Access forbidden for this role")

    #search for patient
    patient = db.query(Patient).filter(Patient.nhs_number == nhs_number).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return {
        "name": patient.name,
        "address": patient.address,
        "medical_history": patient.medical_history,
    }


@router.post("/assign-patient")
def assign_patient(
    call_details: str = Query(..., description="Details of the call"),
    ambulance_id: str = Query(..., description="ID of the ambulance"),
    nhs_number: str = Query(..., description="NHS number of the patient"),
    db: Session = Depends(get_db),
    user = Depends(authenticate_user)
):

    if user["role"] != "headquarter":
        raise HTTPException(status_code=403, detail="Access forbidden for this role")

    patient = db.query(Patient).filter(Patient.nhs_number == nhs_number).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    ambulance = db.query(Ambulance).filter(Ambulance.ambulance_id == ambulance_id, Ambulance.status == "available").first()
    if not ambulance:
        raise HTTPException(status_code=400, detail="Ambulance not available")

    #find hospital with the most availability
    hospital = db.query(Hospital).order_by((Hospital.max_capacity - Hospital.current_capacity).desc()).first()
    if not hospital or hospital.current_capacity >= hospital.max_capacity:
        raise HTTPException(status_code=400, detail="No hospitals available")

    #create assignment
    assignment = Assignment(
        nhs_number=nhs_number,
        ambulance_id=ambulance_id,
        hospital_id=hospital.hospital_id,
        call_details=f"Headquarter notes: {call_details}",
        status="pending"
    )
    db.add(assignment)

    #update status of hospital and ambulance
    ambulance.status = "busy"
    hospital.current_capacity += 1

    db.commit()
    db.refresh(assignment)

    return {"message": "Assignment created successfully", "assignment_id": assignment.assignment_id}



@router.get("/available-ambulances")
def available_ambulances(
    db: Session = Depends(get_db),
    user=Depends(authenticate_user)
):
    if user["role"] != "headquarter":
        raise HTTPException(status_code=403, detail="Access forbidden for this role")

    ambulances = db.query(Ambulance).filter(Ambulance.status == "available").all()
    return {"ambulances": [{"ambulance_id": a.ambulance_id} for a in ambulances]}

@router.post("/add-notes")
def add_notes(
    notes: str,
    user=Depends(authenticate_user),
    db: Session = Depends(get_db)
):
    if user["role"] != "ambulance":
        raise HTTPException(status_code=403, detail="Unauthorized access")

    assignment = db.query(Assignment).filter(Assignment.ambulance_id == user["username"]).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="No assignment found for this ambulance")

    #add notes from ambulance
    assignment.call_details = f"{assignment.call_details}<br>Ambulance Notes: {notes}"
    assignment.status = "Ambulance action notes added"
    db.commit()

    return {"message": "Notes added successfully"}
