// const sessionToken = sessionStorage.getItem("sessionToken");
// const userRole = sessionStorage.getItem("userRole");

// if (!sessionToken || userRole !== "ambulance") {
//     alert("Unauthorized access! Please log in.");
//     window.location.href = "/presentation/ambulance_login.html";
// }

// async function fetchAssignedPatient() {
//     try {
//         const response = await fetch("/ambulances/view-assignment", {
//             headers: {
//                 Authorization: `Bearer ${sessionToken}`
//             }
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log("Assignment data:", data); // Log the response to debug

//             // Populate patient details
//             document.getElementById("patientDetails").innerHTML = `
//                 <h3>Patient Details</h3>
//                 <p>Name: ${data.patient_details.name}</p>
//                 <p>Address: ${data.patient_details.address}</p>
//                 <p>Medical History: ${data.patient_details.medical_history}</p>
//             `;

//             // Populate hospital details
//             document.getElementById("hospitalDetails").innerHTML = `
//                 <h3>Hospital Details</h3>
//                 <p>Name: ${data.hospital_details.name}</p>
//                 <p>Address: ${data.hospital_details.address}</p>
//             `;

//             // Populate call details
//             document.getElementById("callDetails").innerHTML = `
//                 <h3>Call Details</h3>
//                 <p>${data.call_details}</p>
//             `;

//             document.getElementById("actionNotesForm").style.display = "block";
//         } else {
//             alert("No patient assignment found!");
//         }
//     } catch (error) {
//         console.error("Error fetching assignment:", error);
//         alert("Failed to load assignment details.");
//     }
// }


// async function submitActionNotes(event) {
//     event.preventDefault();
//     const actionNotes = document.getElementById("actionNotes").value;

//     const response = await fetch("/ambulances/add-notes", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${sessionToken}`
//         },
//         body: JSON.stringify({ notes: actionNotes })
//     });

//     if (response.ok) {
//         alert("Notes submitted successfully!");
//         document.getElementById("actionNotes").value = ""; // Clear the form
//     } else {
//         const error = await response.json();
//         console.error("Error submitting notes:", error);
//         alert(`Error: ${error.detail}`);
//     }
// }


// fetchAssignedPatient();

// async function logout() {
//     try {
//         const response = await fetch(`/auth/logout?token=${sessionToken}`);

//         if (response.ok) {
//             alert("Logout successful!");
//             sessionStorage.clear(); // Clear session storage
//             window.location.href = "/presentation/ambulance_login.html";
//         } else {
//             const error = await response.json();
//             alert(`Error: ${error.detail}`);
//         }
//     } catch (error) {
//         console.error("Logout error:", error);
//         alert("An error occurred during logout. Please try again.");
//     }
// }

const sessionToken = sessionStorage.getItem("sessionToken");
const userRole = sessionStorage.getItem("userRole");

if (!sessionToken || userRole !== "ambulance") {
    alert("Unauthorized access! Please log in.");
    window.location.href = "/presentation/ambulance_login.html";
}

async function fetchAssignedPatient() {
    try {
        const response = await fetch("/ambulances/view-assignment", {
            headers: {
                Authorization: `Bearer ${sessionToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Fetched assignment data:", data);

            // Render patient details
            document.getElementById("patientDetails").innerHTML = `
                <h3>Patient Details</h3>
                <p>Name: ${data.patient_details.name}</p>
                <p>Address: ${data.patient_details.address}</p>
                <p>Medical History: ${data.patient_details.medical_history}</p>
            `;

            // Render hospital details
            document.getElementById("hospitalDetails").innerHTML = `
                <h3>Hospital Details</h3>
                <p>Name: ${data.hospital_details.name}</p>
                <p>Address: ${data.hospital_details.address}</p>
            `;

            // Render call details
            document.getElementById("callDetails").innerHTML = `
                <h3>Call Details</h3>
                <p>${data.call_details}</p>
            `;

            // Show the action notes form
            document.getElementById("actionNotesForm").style.display = "block";
        } else {
            const error = await response.json();
            console.error("Error fetching assignment:", error);
            alert("No patient assignment found!");
        }
    } catch (error) {
        console.error("Error fetching assignment:", error);
        alert("Failed to load assignment details.");
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
        alert("Notes submitted successfully!");
        document.getElementById("actionNotes").value = ""; // Clear the form
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
