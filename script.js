document.addEventListener('DOMContentLoaded', () => {
    // --- 1. RENT APPLICATION FORM ---
    const form = document.getElementById('rent-application-form');
    const storageKey = 'spothouse_application_form';

    if (form) {
        // Auto-save progress
        form.addEventListener('input', () => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            localStorage.setItem(storageKey, JSON.stringify(data));
        });

        // Load existing data
        const savedData = JSON.parse(localStorage.getItem(storageKey));
        if (savedData) {
            Object.keys(savedData).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) input.value = savedData[key];
            });
        }

        // Form Submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving...';

            const formData = new FormData(form);
            const payload = {
                application_id: `SH-${Date.now()}`,
                timestamp: new Date().toISOString(),
                personal_info: {
                    full_name: formData.get('full_name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                }
            };

            try {
                const response = await fetch('http://localhost:5503/apply', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if(response.ok) {
                    alert("Application Submitted!");
                    localStorage.removeItem(storageKey); // Clear draft after success
                    form.reset();
                }
            } catch (err) {
                console.error("Submission failed", err);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        });
    }

    // --- 2. NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            const navContainer = navbar.querySelector('.max-w-7xl > div');
            if (window.scrollY > 30) {
                navContainer.classList.add('bg-slate-900/90', 'py-2', 'shadow-2xl');
                navContainer.classList.remove('bg-slate-500', 'py-3');
            } else {
                navContainer.classList.add('bg-slate-500', 'py-3');
                navContainer.classList.remove('bg-slate-900/90', 'py-2', 'shadow-2xl');
            }
        });
    }
});

// --- 3. BOOKING FUNCTION (Outside DOMContentLoaded so it's globally accessible) ---
async function booking(title, standard, price, location) {
    try {
        const response = await fetch('http://localhost:5503/bookings', { // Use actual URL string
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, standard, price, location, timestamp: new Date().toISOString() })
        });
        return await response.json();
    } catch (error) {
        console.error("Booking Error:", error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // Select all necessary elements
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.querySelector('.lg\\:flex'); // Your desktop links container

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            // 1. Toggle visibility of the menu
            const isHidden = mobileMenu.classList.toggle('hidden');
            
            // 2. Add/Remove specific mobile styling classes
            // This ensures the menu looks right when it appears
            mobileMenu.classList.toggle('flex', !isHidden);
            mobileMenu.classList.toggle('flex-col', !isHidden);
            
            // 3. Update the Icon (Bars vs X)
            if (menuIcon) {
                if (isHidden) {
                    menuIcon.classList.replace('fa-times', 'fa-bars');
                } else {
                    menuIcon.classList.replace('fa-bars', 'fa-times');
                }
            }
        });
    }
});
