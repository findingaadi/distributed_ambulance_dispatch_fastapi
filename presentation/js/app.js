const BASE_URL = "http://127.0.0.1:8000"; // Adjust if hosted elsewhere

async function viewDashboard() {
    if (!sessionToken) {
        alert("Please log in first!");
        return;
    }
    const response = await fetch(`/hq/dashboard`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
    });
    const data = await response.json();
    document.getElementById("output").innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}

async function searchPatient(event) {
    event.preventDefault();
    const nhsNumber = document.getElementById("nhsNumber").value;

    const response = await fetch(`/hq/search-patient?nhs_number=${nhsNumber}`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
    });
    const data = await response.json();

    if (response.status === 200) {
        document.getElementById("patientDetails").innerHTML = `
            <h2>Patient Found</h2>
            <p>Name: ${data.name}</p>
            <p>Address: ${data.address}</p>
            <p>Medical History: ${data.medical_history}</p>
        `;
        document.getElementById("assignmentForm").style.display = "block";
    } else {
        alert(`Error: ${data.detail}`);
    }
}

async function assignPatient(event) {
    event.preventDefault();
    const callDetails = document.getElementById("callDetails").value;
    const ambulanceId = parseInt(document.getElementById("ambulanceId").value);

    const response = await fetch("/hq/assign-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
        body: JSON.stringify({ call_details: callDetails, ambulance_id: ambulanceId })
    });
    const data = await response.json();

    if (response.status === 200) {
        alert("Patient assigned successfully!");
    } else {
        alert(`Error: ${data.detail}`);
    }
}


async function viewIncomingPatients() {
    const hospitalId = prompt("Enter Hospital ID:");
    const response = await fetch(`${BASE_URL}/hospitals/incoming-patients?hospital_id=${hospitalId}`);
    const data = await response.json();
    displayOutput(data);
}

async function viewAssignment() {
    const ambulanceId = prompt("Enter Ambulance ID:");
    const response = await fetch(`${BASE_URL}/ambulances/view-assignment?ambulance_id=${ambulanceId}`);
    const data = await response.json();
    displayOutput(data);
}

async function updateStatus(status) {
    const ambulanceId = prompt("Enter Ambulance ID:");
    const response = await fetch(`${BASE_URL}/ambulances/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ambulance_id: parseInt(ambulanceId), status })
    });
    const data = await response.json();
    displayOutput(data);
}

function displayOutput(data) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
}


async function logout() {
    if (!sessionToken) {
        alert("Not logged in!");
        return;
    }
    const response = await fetch(`/auth/logout?token=${sessionToken}`);
    const data = await response.json();
    if (response.status === 200) {
        sessionToken = null;
        alert("Logout successful!");
    } else {
        alert(`Error: ${data.detail}`);
    }
}

let sessionToken = null;
let userRole = null;

async function performLogin(event) {
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

        alert("Login successful!");

        // Redirect to role-specific dashboard
        if (userRole === "headquarter") {
            window.location.href = "/presentation/headquarters.html";
        } else if (userRole === "ambulance") {
            window.location.href = "/presentation/ambulance.html";
        } else if (userRole === "hospital") {
            window.location.href = "/presentation/hospital.html";
        }
    } else {
        alert(`Error: ${data.detail}`);
    }
}
