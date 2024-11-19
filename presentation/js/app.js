const BASE_URL = "http://127.0.0.1:8000"; // Adjust if hosted elsewhere

async function viewDashboard() {
    const response = await fetch(`${BASE_URL}/hq/dashboard`);
    const data = await response.json();
    displayOutput(data);
}

async function searchPatient() {
    const nhsNumber = prompt("Enter NHS number:");
    const response = await fetch(`${BASE_URL}/hq/search-patient?nhs_number=${nhsNumber}`);
    const data = await response.json();
    displayOutput(data);
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
