

const registerForm = document.getElementById("registerForm");

// REGISTRATION
if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        try {
            const response = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    confirmPassword
                })
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                window.location.href = "index.html";
            }
        } catch (error) {
            alert("Server connection failed. Please try again.");
            console.error(error);
        }
    });
}


// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            alert(data.message);

        } catch (error) {
            alert("Server connection failed. Please try again.");
            console.error(error);
        }
    });
}
