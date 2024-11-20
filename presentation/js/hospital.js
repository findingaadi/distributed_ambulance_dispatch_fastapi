async function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        // Send login request
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Login successful:", data);

            // Store session token and user role in sessionStorage
            sessionStorage.setItem("sessionToken", data.token);
            sessionStorage.setItem("userRole", data.role);
            console.log("Token:", sessionStorage.getItem("sessionToken"));
            console.log("Role:", sessionStorage.getItem("userRole"));

            // Redirect to the dashboard
            window.location.href = "/presentation/hospital_dashboard.html";
        } else {
            const error = await response.json();
            alert(`Error: ${error.detail}`);
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login. Please try again.");
    }
}
