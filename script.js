const contact = document.getElementById('contact');
contact.addEventListener('click', function() {
    alert('You clicked the contact section!');
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('rent-application-form');
    const storageKey = 'spothouse_application_form';

    // 1. AUTO-SAVE PROGRESS TO:(Local Storage)
    form.addEventListener('input', () => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem(storageKey, JSON.stringify(data));
    });

    // 2. LOAD EXISTING DATA
    // If user refreshes or returns, refill the form
    const savedData = JSON.parse(localStorage.getItem(storageKey));
    if (savedData) {
        Object.keys(savedData).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) input.value = savedData[key];
        });
    }

    // 3. AJAX SUBMISSION
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Visual feedback
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Saving Progress...';

        const formData = new FormData(form);
        const payload = {
            application_id: `SH-${Date.now()}`,
            timestamp: new Date().toISOString(),
            personal_info: {
                full_name: formData.get('full_name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                dob: formData.get('dob'),
                id_number: formData.get('id_passport')
            },
            residency: {
                address: formData.get('address'),
                city: formData.get('city'),
                rent: formData.get('current_rent')
            }
        };
         
    });

    
});
const name = document.getElementById('tenant-contact').value;
const message = document.getElementById('message-form').value;
console.log(`sending message from ${name}: ${message}`);

const feedback = document.getElementById('feedback-message');
feedback.textContent = 'Message sent successfully!';
async function booking(title, standard, price, location) {
    
    const response = await fetch(JSON, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            title, 
            standard, 
            price, 
            location,
            timestamp: new Date().toISOString() 
        })
    });

    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
};

 document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');

    // 1. Scroll Effect Logic
    window.addEventListener('scroll', () => {
        // Targets the inner glass card container inside your nav
        const navContainer = navbar.querySelector('.max-w-7xl > div');

        if (window.scrollY > 30) {
            // Apply "Scrolled" state: Darker glass, smaller padding, and shadow
            navContainer.classList.replace('bg-slate-500', 'bg-slate-900/90');
            navContainer.classList.add('py-2', 'shadow-2xl', 'border-slate-600');
            navContainer.classList.remove('py-3', 'border-slate-700/50');
        } else {
            // Revert to "Top" state: Lighter glass, more padding
            navContainer.classList.replace('bg-slate-900/90', 'bg-slate-500');
            navContainer.classList.add('py-3', 'border-slate-700/50');
            navContainer.classList.remove('py-2', 'shadow-2xl', 'border-slate-600');
        }
    });

    // 2. Mobile Menu Toggle
    const menuBtn = document.querySelector('button.lg\\:hidden'); // Targets your mobile toggle
    const navLinks = document.querySelector('.lg\\:flex'); // Desktop links container

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            // Toggles visibility on mobile
            navLinks.classList.toggle('hidden');
            navLinks.classList.toggle('flex');
            navLinks.classList.toggle('flex-col');
            navLinks.classList.toggle('absolute');
            navLinks.classList.toggle('top-20');
            navLinks.classList.toggle('left-6');
            navLinks.classList.toggle('right-6');
            navLinks.classList.toggle('bg-slate-800');
            navLinks.classList.toggle('p-6');
            navLinks.classList.toggle('rounded-2xl');
        });
    }
});



const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');

        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Switch icon between 'bars' and 'times' (X)
            if (mobileMenu.classList.contains('hidden')) {
                menuIcon.classList.replace('fa-times', 'fa-bars');
            } else {
                menuIcon.classList.replace('fa-bars', 'fa-times');
            }
        });


