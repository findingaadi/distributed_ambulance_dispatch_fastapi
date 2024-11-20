# from database import SessionLocal
# from models import User, Patient, Hospital, Ambulance

# db = SessionLocal()

# # Add initial users
# db.add(User(username="hq_admin", password="securepassword1", role="headquarter"))
# db.add(User(username="ambulance_driver_1", password="securepassword2", role="ambulance"))
# db.add(User(username="hospital_staff_1", password="securepassword3", role="hospital"))

# # Add initial patients
# db.add(Patient(nhs_number="123456789", name="John Doe", address="123 Elm Street", medical_history="Diabetic, Hypertension"))
# db.add(Patient(nhs_number="987654321", name="Jane Smith", address="456 Oak Avenue", medical_history="Asthma, Allergies"))

# # Add initial hospitals
# db.add(Hospital(name="General Hospital", max_capacity=200, current_capacity=50))
# db.add(Hospital(name="City Hospital", max_capacity=150, current_capacity=120))

# # Add initial ambulances
# db.add(Ambulance(status="available"))
# db.add(Ambulance(status="available"))

# db.commit()
# db.close()

# print("Initial data added.")

# from database import SessionLocal
# from models import Assignment

# db = SessionLocal()

# # Add a test assignment
# db.add(Assignment(
#     patient_id=1,
#     ambulance_id=1,
#     hospital_id=1,
#     call_details="Test assignment for ambulance 1",
#     status="pending"
# ))

# db.commit()
# db.close()

# print("Test assignment added.")
