// Get session data
const sessionToken = sessionStorage.getItem("sessionToken");
const userRole = sessionStorage.getItem("userRole");

// Redirect to login if session is invalid
if (!sessionToken || userRole !== "headquarter") {
    alert("Unauthorized access! Please log in.");
    window.location.href = "/presentation/headquarters_login.html";
}

// Fetch available ambulances
async function fetchAvailableAmbulances() {
    const response = await fetch("/hq/available-ambulances", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionToken}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        const ambulanceDropdown = document.getElementById("ambulanceId");
        ambulanceDropdown.innerHTML = ""; // Clear previous options

        data.ambulances.forEach(ambulance => {
            const option = document.createElement("option");
            option.value = ambulance.ambulance_id;
            option.text = `Ambulance ID: ${ambulance.ambulance_id}`;
            ambulanceDropdown.appendChild(option);
        });

        document.getElementById("availableAmbulances").style.display = "block";
        document.getElementById("assignmentForm").style.display = "block";
    } else {
        alert("Error fetching available ambulances");
    }
}

// Modify Search Patient to include fetching ambulances
async function searchPatient(event) {
    event.preventDefault();
    const nhsNumber = document.getElementById("nhsNumber").value;

    const response = await fetch(`/hq/search-patient?nhs_number=${nhsNumber}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionToken}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        document.getElementById("patientDetails").innerHTML = `
            <h2>Patient Found</h2>
            <p>Name: ${data.name}</p>
            <p>Address: ${data.address}</p>
            <p>Medical History: ${data.medical_history}</p>
        `;

        // Fetch available ambulances after patient search
        fetchAvailableAmbulances();
    } else {
        const error = await response.json();
        alert(`Error: ${error.detail}`);
    }
}


// Logout function
async function logout() {
    try {
        const response = await fetch(`/auth/logout?token=${sessionToken}`);

        if (response.ok) {
            alert("Logout successful!");
            sessionStorage.clear(); // Clear session storage
            window.location.href = "/presentation/headquarters_login.html";
        } else {
            const error = await response.json();
            alert(`Error: ${error.detail}`);
        }
    } catch (error) {
        console.error("Logout error:", error);
        alert("An error occurred during logout. Please try again.");
    }
}

async function createAssignment(event) {
    event.preventDefault();

    const callDetails = document.getElementById("callDetails").value;
    const ambulanceId = document.getElementById("ambulanceId").value;
    const nhsNumber = document.getElementById("nhsNumber").value; // Directly fetch NHS number from the input field

    if (!nhsNumber) {
        alert("Please enter an NHS number to proceed.");
        return;
    }

    const response = await fetch(`/hq/assign-patient?call_details=${callDetails}&ambulance_id=${ambulanceId}&nhs_number=${nhsNumber}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("sessionToken")}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        alert("Assignment created successfully!");
    } else {
        const error = await response.json();
        alert(`Error: ${JSON.stringify(error.detail)}`);
    }
}
