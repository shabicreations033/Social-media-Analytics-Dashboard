document.querySelector(".register-form").addEventListener("submit", function(event) {
    const fullName = document.querySelector("input[placeholder='Full Name']").value;
    const email = document.querySelector("input[placeholder='Email']").value;
    const password = document.querySelector("input[placeholder='Password']").value;
    const confirmPassword = document.querySelector("input[placeholder='Confirm Password']").value;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    
    if (fullName.trim().length < 3) {
        alert("Full Name must be at least 3 characters long.");
        event.preventDefault();
    } else if (!emailRegex.test(email)) {
        alert("Invalid email format.");
        event.preventDefault();
    } else if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters long and contain at least one letter and one number.");
        event.preventDefault();
    } else if (password !== confirmPassword) {
        alert("Passwords do not match.");
        event.preventDefault();
    }
});
