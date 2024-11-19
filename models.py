from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False)

class Patient(Base):
    __tablename__ = "patients"

    patient_id = Column(Integer, primary_key=True, index=True)
    nhs_number = Column(String(20), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=True)
    medical_history = Column(Text, nullable=True)

class Ambulance(Base):
    __tablename__ = "ambulances"

    ambulance_id = Column(Integer, primary_key=True, index=True)
    status = Column(String(20), nullable=False, default="available")

class Hospital(Base):
    __tablename__ = "hospitals"

    hospital_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    max_capacity = Column(Integer, nullable=False)
    current_capacity = Column(Integer, nullable=False)

class Assignment(Base):
    __tablename__ = "assignments"

    assignment_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.patient_id"), nullable=False)
    ambulance_id = Column(Integer, ForeignKey("ambulances.ambulance_id"), nullable=False)
    hospital_id = Column(Integer, ForeignKey("hospitals.hospital_id"), nullable=False)
    call_details = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="pending")

    patient = relationship("Patient")
    ambulance = relationship("Ambulance")
    hospital = relationship("Hospital")
