const registrationForm = document.getElementById('registrationForm');

        registrationForm.addEventListener('submit', function(e) {
            // 1. Prevent the page from refreshing immediately
            e.preventDefault();

            // 2. Capture the data from the inputs
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // 3. Simple Logic: Check if passwords match
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            // 4. Create a User Object
            const userData = {
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                password: password // In a real app, never store plain text passwords!
            };

            // 5. Save to LocalStorage (Key: 'user')
            // We use JSON.stringify because localStorage only saves strings
            localStorage.setItem('user', JSON.stringify(userData));

            alert("Registration successful! Redirecting to login...");

            // 6. Redirect to your login page
            window.location.href = "log.html";
        });
         const loginForm = document.getElementById('loginForm');

        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // 1. Get the values entered in the login form
            const enteredId = document.getElementById('loginIdentifier').value;
            const enteredPass = document.getElementById('loginPassword').value;

            // 2. Fetch the stored user from localStorage
            const storedUser = localStorage.getItem('user');

            // 3. Check if any user actually exists
            if (!storedUser) {
                alert("No account found. Please register first.");
                return;
            }

            // 4. Parse the stored string back into a JavaScript Object
            const user = JSON.parse(storedUser);

            // 5. Comparison Logic
            // We check if the ID matches either the stored username OR the stored email
            const isUsernameMatch = (enteredId === user.username || enteredId === user.email);
            const isPasswordMatch = (enteredPass === user.password);

            if (isUsernameMatch && isPasswordMatch) {
                alert("Login successful! Welcome, " + user.firstName);
                window.location.href = "contact.html"; // Redirect to your success page
            } else {
                alert("Invalid credentials. Please try again.");
            }
        });