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

        try {
         const response = await fetch('http://localhost:5503/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
    });

    if (response.ok) {
        localStorage.removeItem(storageKey); // Clear draft after success
        alert('Application Saved Successfully!');
    }
    } catch (error) {
       console.error("Data error:", error);
     }
    });
});
const name = document.getElementById('tenant-contact').value;
const message = document.getElementById('message-form').value;
console.log(`sending message from ${name}: ${message}`);

const feedback = document.getElementById('feedback-message');
feedback.textContent = 'Message sent successfully!';
async function booking(title, standard, price, location) {
    const url = 'http://localhost:5503/bookings'; // Using local JSON server
    
    const response = await fetch(url, {
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
    const payButtons = document.querySelectorAll('div.flex.gap-4.mb-8 button');
    const formContainer = document.querySelector('form');
    const submitBtn = document.querySelector('button[onclick="makepayment()"]');

    // 1. Handle Payment Method Switching
    payButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active style from all buttons
            payButtons.forEach(b => {
                b.classList.remove('border-slate-900', 'bg-slate-50');
                b.classList.add('border-gray-100');
            });

            // Add active style to clicked button
            btn.classList.add('border-slate-900', 'bg-slate-50');
            btn.classList.remove('border-gray-100');

            const method = btn.querySelector('span').innerText.toLowerCase();
            updateFormUI(method);
        });
    });

    // 2. Dynamic UI Update (payment)
    function updateFormUI(method) {
        if (method === 'm-pesa') {
            formContainer.innerHTML = `
                <div class="animate-fade-in">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">M-Pesa Phone Number</label>
                    <input type="text" id="phone" class="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900" placeholder="0700 000 000">
                    <p class="text-[10px] text-gray-400 mt-2">You will receive an STK Push on your phone.</p>
                </div>
                <div class="pt-6">
                    <button type="button" id="process-payment" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95">
                        Pay with M-Pesa
                    </button>
                </div>
            `;
        } else if (method === 'card') {
             location.reload(); // Simplest way to revert to default card HTML
        }
        // Add listener back to the new dynamic button
        document.getElementById('process-payment')?.addEventListener('click', makePayment);
    }

    // 3. AJAX Payment Submission
    window.makePayment = async function() {
    // ... (Your loading state logic)
    const paymentData = {
        id: `TXN-${Date.now()}`,
        amount: 92500,
        currency: 'Kshs',
        method: document.getElementById('phone') ? 'M-Pesa' : 'Card',
        status: 'success'
    };

    try {
        const response = await fetch('http://localhost:5503/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });

        if (response.ok) {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        alert('Payment failed.');
    }
};

    // Link the original HTML button to the function
    submitBtn.onclick = makePayment;
});


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


function filterhouse (){
    const location =getElementById('location,');
    const priceRange= getElementById(price);

    document.querySelectorAll('proparty card').forEach(card => {
        const matchLocation=location=== 'All' ||card.setData.location ===
    });
}
//image preview
const roomLable =[`living room ,kitchen, Bedroom Bathroom`]
function handleImagePreview(input) {
    const grid = document.getElementById('image-preview');
    grid.innerHTML = '';
    
    Array.from(input.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Create preview card with dropdown labels
            const card = createPreviewCard(e.target.result);
            grid.appendChild(card);
        };
        reader.readAsDataURL(file);
    });
}
//function fetch and display dashbord data

     //updates
     async function refreshDashboard() {
    let url = 'http://localhost:5503/dashboard';
    try {
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById('first-revenue').innerText = `Kshs ${data.revenue.toLocaleString()}`;
        document.getElementById('first-tenant').innerText = data.activeTenants;

        const tableBody = document.getElementById('tenant-table');
        tableBody.innerHTML = data.tenants.map(tenant => `
            <tr>
              <td>${tenant.name}</td>
              <td>${tenant.property}</td>
              <td><span class="status">${tenant.status}</span></td>
            </tr>
        `).join(''); // .join('')  remove commas between rows
    } catch (error) {
        console.error("An error occurred:", error);
    }
}


