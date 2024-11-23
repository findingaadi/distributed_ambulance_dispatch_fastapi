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
            <p>Name: ${data.patient_details.name}</p>
            <p>Address: ${data.patient_details.address}</p>
            <p>Medical History: ${data.patient_details.medical_history}</p>
        `;
        document.getElementById("hospitalDetails").innerHTML = `
            <h3>Hospital Details</h3>
            <p>Name: ${data.hospital_details.name}</p>
            <p>Address: ${data.hospital_details.address}</p>
        `;
        document.getElementById("callDetails").innerHTML = `
            <h3>Call Details</h3>
            <p>${data.call_details}</p>
        `;
        document.getElementById("actionNotesForm").style.display = "block";
    } else if (response.status === 404) {
        document.getElementById("patientDetails").innerHTML = `
            <p>No active assignments found.</p>
        `;
        document.getElementById("hospitalDetails").innerHTML = "";
        document.getElementById("callDetails").innerHTML = "";
        document.getElementById("actionNotesForm").style.display = "none";
    } else {
        alert("Failed to fetch assignments.");
    }
}


fetchAssignedPatient();

async function submitActionNotes(event) {
    event.preventDefault();
    const actionNotes = document.getElementById("actionNotes").value;

    const response = await fetch("/ambulances/add-notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${sessionToken}`,
        },
        body: new URLSearchParams({
            notes: actionNotes,
        }),
    });

    if (response.ok) {
        alert("Notes submitted successfully");
        document.getElementById("actionNotes").value = "";
    } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
    }
}


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
