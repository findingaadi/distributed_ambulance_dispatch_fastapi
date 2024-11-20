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
                    <p>Action Notes: ${patient.action_details || "No notes added yet"}</p>
                </div>
            `).join("")}
        `;
    } else {
        alert(`Error: ${data.detail}`);
    }
}

async function login(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${username}&password=${password}`
    });
    const data = await response.json();

    if (response.status === 200) {
        sessionToken = data.session_token;
        userRole = data.role;

        if (userRole === "hospital") {
            window.location.href = "/presentation/hospital_dashboard.html";
        } else {
            alert("Invalid login for hospital.");
        }
    } else {
        alert(`Error: ${data.detail}`);
    }
}
