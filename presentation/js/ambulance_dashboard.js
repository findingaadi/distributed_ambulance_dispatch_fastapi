const sessionToken = sessionStorage.getItem("sessionToken");
const userRole = sessionStorage.getItem("userRole");

if (!sessionToken || userRole !== "ambulance") {
    alert("Unauthorized access! Please log in.");
    window.location.href = "/presentation/ambulance_login.html";
}

async function fetchAssignedPatient() {
    const response = await fetch("/ambulances/view-assignment", {
        headers: {
            Authorization: `Bearer ${sessionToken}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById("patientDetails").innerHTML = `
            <h3>Patient Details</h3>
            <p>Name: ${data.name}</p>
            <p>Address: ${data.address}</p>
            <p>Medical History: ${data.medical_history}</p>
        `;
        document.getElementById("actionNotesForm").style.display = "block";
    } else {
        alert("No patient assignment found!");
    }
}

async function submitActionNotes(event) {
    event.preventDefault();
    const actionNotes = document.getElementById("actionNotes").value;

    const response = await fetch("/ambulances/add-notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ notes: actionNotes })
    });

    if (response.ok) {
        alert("Notes submitted successfully!");
        document.getElementById("actionNotes").value = ""; // Clear the form
    } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
    }
}

fetchAssignedPatient();

async function logout() {
    try {
        const response = await fetch(`/auth/logout?token=${sessionToken}`);

        if (response.ok) {
            alert("Logout successful!");
            sessionStorage.clear(); // Clear session storage
            window.location.href = "/presentation/ambulance_login.html";
        } else {
            const error = await response.json();
            alert(`Error: ${error.detail}`);
        }
    } catch (error) {
        console.error("Logout error:", error);
        alert("An error occurred during logout. Please try again.");
    }
}