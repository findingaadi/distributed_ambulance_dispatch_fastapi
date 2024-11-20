const sessionToken = sessionStorage.getItem("sessionToken");
const userRole = sessionStorage.getItem("userRole");

if (!sessionToken || userRole !== "hospital") {
    alert("Unauthorized access! Please log in.");
    window.location.href = "/presentation/hospital_login.html";
}

async function fetchAssignments() {
    const response = await fetch("/hospitals/view-assignments", {
        headers: {
            Authorization: `Bearer ${sessionToken}`
        }
    });

    if (response.ok) {
        const assignments = await response.json();
        const assignmentsDiv = document.getElementById("assignments");
        assignmentsDiv.innerHTML = assignments.map(assignment => `
            <div>
                <h3>Assignment ID: ${assignment.assignment_id}</h3>
                <p>Patient Name: ${assignment.patient_name}</p>
                <p>Ambulance Action Notes: ${assignment.ambulance_notes || "No notes yet"}</p>
                <button onclick="populateUpdateForm(${assignment.assignment_id})">Update Record</button>
            </div>
        `).join("");
    } else {
        alert("Failed to fetch assignments.");
    }
}

function populateUpdateForm(assignmentId) {
    document.getElementById("updateRecordForm").dataset.assignmentId = assignmentId;
    document.getElementById("updateRecordForm").style.display = "block";
}

async function updatePatientRecord(event) {
    event.preventDefault();
    const assignmentId = document.getElementById("updateRecordForm").dataset.assignmentId;
    const callDetails = document.getElementById("callDetails").value;
    const timeSpent = document.getElementById("timeSpent").value;

    const response = await fetch(`/hospitals/update-record`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ assignment_id: assignmentId, call_details: callDetails, time_spent: timeSpent })
    });

    if (response.ok) {
        alert("Record updated successfully!");
        document.getElementById("updateRecordForm").reset();
        document.getElementById("updateRecordForm").style.display = "none";
        fetchAssignments(); // Refresh assignments
    } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
    }
}

fetchAssignments();

async function logout() {
    const response = await fetch(`/auth/logout?token=${sessionToken}`);

    if (response.ok) {
        alert("Logout successful!");
        sessionStorage.clear();
        window.location.href = "/presentation/hospital_login.html";
    } else {
        alert("Error during logout!");
    }
}
