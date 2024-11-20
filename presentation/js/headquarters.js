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
