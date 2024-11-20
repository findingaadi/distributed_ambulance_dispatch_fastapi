from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from database import get_db
from utils import authenticate_user
from models import Patient, Ambulance, Hospital, Assignment


router = APIRouter()

@router.get("/search-patient")
def search_patient(nhs_number: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.nhs_number == nhs_number).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/assign-patient")
def assign_patient(
    nhs_number: str = Form(...),
    ambulance_id: int = Form(...),
    db: Session = Depends(get_db)
):
    # Check if patient exists
    patient = db.query(Patient).filter(Patient.nhs_number == nhs_number).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Check if ambulance is available
    ambulance = db.query(Ambulance).filter(Ambulance.ambulance_id == ambulance_id, Ambulance.status == "available").first()
    if not ambulance:
        raise HTTPException(status_code=400, detail="Ambulance not available")
    
    # Find the hospital with the highest availability
    hospital = db.query(Hospital).order_by((Hospital.max_capacity - Hospital.current_capacity).desc()).first()
    if not hospital or hospital.current_capacity >= hospital.max_capacity:
        raise HTTPException(status_code=400, detail="No hospitals available")
    
    # Create an assignment
    assignment = Assignment(
        patient_id=patient.patient_id,
        ambulance_id=ambulance.ambulance_id,
        hospital_id=hospital.hospital_id,
        call_details="Assigned by HQ",
        status="pending"
    )
    ambulance.status = "busy"
    hospital.current_capacity += 1

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return {
        "message": "Patient assigned successfully",
        "assignment_id": assignment.assignment_id,
        "hospital": hospital.name,
        "ambulance_id": ambulance.ambulance_id
    }




@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    user = Depends(authenticate_user)  # Require login
):
    if user.role != "headquarter":
        raise HTTPException(status_code=403, detail="Access forbidden for this role")

    assignments = db.query(Assignment).all()
    ambulances = db.query(Ambulance).all()
    hospitals = db.query(Hospital).all()

    return {
        "assignments": [
            {
                "assignment_id": a.assignment_id,
                "patient_id": a.patient_id,
                "ambulance_id": a.ambulance_id,
                "hospital_id": a.hospital_id,
                "call_details": a.call_details,
                "status": a.status
            }
            for a in assignments
        ],
        "ambulances": [
            {"ambulance_id": amb.ambulance_id, "status": amb.status}
            for amb in ambulances
        ],
        "hospitals": [
            {"hospital_id": h.hospital_id, "name": h.name, "current_capacity": h.current_capacity, "max_capacity": h.max_capacity}
            for h in hospitals
        ]
    }
