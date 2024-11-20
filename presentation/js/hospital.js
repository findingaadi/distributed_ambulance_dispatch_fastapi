async function viewIncomingPatients(event) {
    event.preventDefault();
    const hospitalId = document.getElementById("hospitalId").value;

    const response = await fetch(`/hospitals/incoming-patients?hospital_id=${hospitalId}`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
    });
    const data = await response.json();

    if (response.status === 200) {
        document.getElementById("patientDetails").innerHTML = `
            <h2>Incoming Patients</h2>
            ${data.map(patient => `
                <div>
                    <p>Assignment ID: ${patient.assignment_id}</p>
                    <p>Patient ID: ${patient.patient_id}</p>
                    <p>Ambulance ID: ${patient.ambulance_id}</p>
                    <p>Call Details: ${patient.call_details}</p>
                    <p>Status: ${patient.status}</p>
                </div>
            `).join("")}
        `;
    } else {
        alert(`Error: ${data.detail}`);
    }
}
