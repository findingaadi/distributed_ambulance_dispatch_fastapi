from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True, autoincrement=True)  # Auto-increment user_id
    username = Column(String(50), unique=True, nullable=False)  # Keep username unique for login
    password = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False)

class Patient(Base):
    __tablename__ = "patients"

    nhs_number = Column(String(20), primary_key=True, unique=True, nullable=False)  # NHS number is now the primary key
    name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=True)
    medical_history = Column(Text, nullable=True)

class Ambulance(Base):
    __tablename__ = "ambulances"

    ambulance_id = Column(String(50), primary_key=True, unique=True, nullable=False)  # Example: "ambulance_1"
    status = Column(String(20), nullable=False, default="available")

class Hospital(Base):
    __tablename__ = "hospitals"

    hospital_id = Column(String(50), primary_key=True, unique=True, nullable=False)  # Example: "hospital_1"
    name = Column(String(100), nullable=False)
    address = Column(String(255), nullable=True)  # Add address column
    max_capacity = Column(Integer, nullable=False)
    current_capacity = Column(Integer, nullable=False)

class Assignment(Base):
    __tablename__ = "assignments"

    assignment_id = Column(Integer, primary_key=True, index=True)
    nhs_number = Column(String(20), ForeignKey("patients.nhs_number"), nullable=False)  # Reference NHS number directly
    ambulance_id = Column(String(50), ForeignKey("ambulances.ambulance_id"), nullable=False)  # Reference ambulance ID directly
    hospital_id = Column(String(50), ForeignKey("hospitals.hospital_id"), nullable=False)  # Reference hospital ID directly
    call_details = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="pending")

    # Relationships
    patient = relationship("Patient")
    ambulance = relationship("Ambulance")
    hospital = relationship("Hospital")
