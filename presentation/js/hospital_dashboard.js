console.log("hospital_dashboard.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    const sessionToken = sessionStorage.getItem("sessionToken");
    const userRole = sessionStorage.getItem("userRole");

    if (!sessionToken || userRole !== "hospital") {
        alert("Unauthorized access! Please log in.");
        window.location.href = "/presentation/hospital_login.html";
    }

    // Fetch assignments when the page loads
    fetchAssignments();

    // Bind event listener for updating assignment
    document.getElementById("updateRecordButton").addEventListener("click", updateAssignment);
});

// Fetch assignments for the logged-in hospital
async function fetchAssignments() {
    console.log("Fetching assignments...");
    const response = await fetch("/hospitals/view-assignments", {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("sessionToken")}`
        }
    });

    if (response.ok) {
        const assignments = await response.json();
        console.log("Assignments fetched:", assignments);

        const assignmentsDiv = document.getElementById("assignments");
        assignmentsDiv.innerHTML = assignments.map(assignment => `
            <div class="assignment-card">
                <h3>Assignment ID: ${assignment.assignment_id}</h3>
                <p><strong>Patient Name:</strong> ${assignment.patient_details?.name || "N/A"}</p>
                <p><strong>Address:</strong> ${assignment.patient_details?.address || "N/A"}</p>
                <p><strong>Medical History:</strong> ${assignment.patient_details?.medical_history || "N/A"}</p>
                <p><strong>Ambulance ID:</strong> ${assignment.ambulance_id || "N/A"}</p>
                <p><strong>Call Details:</strong> ${assignment.call_details || "N/A"}</p>
                <p><strong>Status:</strong> ${assignment.status || "N/A"}</p>
                <button onclick="showUpdateForm(${assignment.assignment_id})">Update Assignment</button>
            </div>
        `).join("");
    } else {
        alert("Failed to fetch assignments.");
    }
}

// Show update form for the selected assignment
function showUpdateForm(assignmentId) {
    const updateForm = document.getElementById("updateRecordForm");
    updateForm.dataset.assignmentId = assignmentId;
    updateForm.style.display = "block";
}

// Update assignment with hospital notes and status
async function updateAssignment(event) {
    event.preventDefault();

    const assignmentId = document.getElementById("updateRecordForm").dataset.assignmentId;
    const callDetails = document.getElementById("callDetails").value.trim();
    const status = document.getElementById("status").value;

    if (!status) {
        alert("Please select a status.");
        return;
    }

    try {
        const formData = new FormData(); // Use FormData for easier form submission
        formData.append("assignment_id", assignmentId);
        formData.append("call_details", callDetails || ""); // Fallback to empty string
        formData.append("status", status);

        const response = await fetch(`/hospitals/update-assignment`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("sessionToken")}`
            },
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            alert("Assignment updated successfully!");
            console.log("Response:", result); // Debugging log
            // document.getElementById("updateRecordForm").reset();
            fetchAssignments(); // Refresh the dashboard
        } else {
            const error = await response.json();
            console.error("Error response:", error); // Debugging log
            alert(`Error: ${error.detail || "Failed to update assignment"}`);
        }
    } catch (err) {
        console.error("Error updating assignment:", err);
        alert("Failed to update the assignment.");
    }
}


// Logout function
function logout() {
    sessionStorage.clear();
    window.location.href = "/presentation/hospital_login.html";
}
