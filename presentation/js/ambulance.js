async function viewAssignment(event) {
    event.preventDefault();
    const ambulanceId = document.getElementById("ambulanceId").value;

    const response = await fetch(`/ambulances/view-assignment?ambulance_id=${ambulanceId}`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
    });
    const data = await response.json();

    if (response.status === 200) {
        document.getElementById("assignmentDetails").innerHTML = `
            <h2>Assignment Details</h2>
            <p>Patient ID: ${data.patient_id}</p>
            <p>Hospital ID: ${data.hospital_id}</p>
            <p>Call Details: ${data.call_details}</p>
        `;
        document.getElementById("actionForm").style.display = "block";
    } else {
        alert(`Error: ${data.detail}`);
    }
}

async function submitActionDetails(event) {
    event.preventDefault();
    const actionDetails = document.getElementById("actionDetails").value;

    const response = await fetch(`/ambulances/update-action-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
        body: JSON.stringify({ action_details: actionDetails })
    });
    const data = await response.json();

    if (response.status === 200) {
        alert("Action details submitted successfully!");
    } else {
        alert(`Error: ${data.detail}`);
    }
}
