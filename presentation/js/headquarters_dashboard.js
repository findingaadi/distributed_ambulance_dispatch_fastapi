// Get session data
const sessionToken = sessionStorage.getItem("sessionToken");
const userRole = sessionStorage.getItem("userRole");

// Redirect to login if session is invalid
if (!sessionToken || userRole !== "headquarter") {
    alert("Unauthorized access! Please log in.");
    window.location.href = "/presentation/headquarters_login.html";
}

async function searchPatient(event) {
    event.preventDefault();
    const nhsNumber = document.getElementById("nhsNumber").value;

    console.log(`Searching for NHS Number: ${nhsNumber}, with token: ${sessionToken}`);

    const response = await fetch(`/hq/search-patient?nhs_number=${nhsNumber}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${sessionToken}` // Ensure token is sent in Bearer format
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

// async function assignPatient(event) {
//     event.preventDefault();
//     const callDetails = document.getElementById("callDetails").value;
//     const ambulanceId = parseInt(document.getElementById("ambulanceId").value);

//     const response = await fetch("/hq/assign-patient", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${sessionToken}` },
//         body: JSON.stringify({ call_details: callDetails, ambulance_id: ambulanceId })
//     });
//     const data = await response.json();

//     if (response.status === 200) {
//         alert("Assignment successful!");
//     } else {
//         alert(`Error: ${data.detail}`);
//     }
// }
