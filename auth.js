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