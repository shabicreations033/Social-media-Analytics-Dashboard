document.getElementById("loginForm").addEventListener("submit", function(event) {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!emailRegex.test(email)) {
        errorMessage.textContent = "Invalid email format!";
        event.preventDefault();
    } else if (!passwordRegex.test(password)) {
        errorMessage.textContent = "Password must be at least 8 characters and contain a letter and a number!";
        event.preventDefault();
    } else {
        errorMessage.textContent = "";
    }
});
