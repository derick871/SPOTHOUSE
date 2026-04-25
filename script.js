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
async function booking(id, title, standard, price, location,) {
    try {
        const response = await fetch('poreties.json', { // Use actual URL string
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id title, standard, price, location, timestamp: new Date().toISOString() })
        });
        return await response.json();
    } catch (error) {
        console.error("Booking Error:", error);
    }
}
//landlord page start
class PropertyManager {
    constructor() {
        // Elements
        this.form = document.querySelector('form');
        this.uploadInput = document.getElementById('gallery-upload');
        this.previewGrid = document.getElementById('image-preview-grid');
        this.submitBtn = document.getElementById('btn');
        this.maxPhotos = 10;

        this.init();
    }

    init() {
        // Bind event listeners
        this.uploadInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // --- Gallery Logic ---
    handleFileUpload(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (this.previewGrid.children.length >= this.maxPhotos) {
                alert(`Limit reached: Maximum ${this.maxPhotos} photos.`);
                return;
            }
            this.renderPreview(file);
        });
    }

    renderPreview(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const card = document.createElement('div');
            card.className = "relative bg-white p-2 rounded-xl shadow-sm border border-slate-200 group";
            card.innerHTML = this.getCardTemplate(event.target.result);
            
            // Add delete functionality
            card.querySelector('.remove-btn').onclick = () => card.remove();
            
            this.previewGrid.appendChild(card);
        };
        reader.readAsDataURL(file);
    }

    getCardTemplate(imageSrc) {
        return `
            <img src="${imageSrc}" class="w-full h-40 object-cover rounded-lg mb-3">
            <input type="text" placeholder="Label (e.g. Master Bedroom)" 
                   class="photo-label w-full text-xs border border-slate-100 rounded px-2 py-1 focus:ring-1 focus:ring-yellow-500 outline-none">
            <button type="button" class="remove-btn absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs shadow-md opacity-0 group-hover:opacity-100 transition">
                <i class="fas fa-times"></i>
            </button>
        `;
    }

    // --- Submission Logic ---
    handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) return;

        const formData = this.collectData();
        console.log("Submitting Property Data:", formData);
        
        this.updateUIStatus("Registering...");
    }

    validateForm() {
        const checkbox = this.form.querySelector('input[type="checkbox"]');
        if (!checkbox.checked) {
            alert("Please certify ownership before proceeding.");
            return false;
        }
        return true;
    }

    collectData() {
        // Collect labels from the dynamic inputs
        const labels = Array.from(this.previewGrid.querySelectorAll('.photo-label'))
                            .map(input => input.value);

        // Return a structured object
        return {
            landlordName: this.form.querySelector('input[placeholder="Derrick Wanyama"]').value,
            rent: this.form.querySelector('input[type="number"]').value,
            labels: labels,
            timestamp: new Date().toISOString()
        };
    }

    updateUIStatus(message) {
        this.submitBtn.innerText = message;
        this.submitBtn.disabled = true;
        this.submitBtn.classList.replace('bg-slate-900', 'bg-green-600');
    }
}

// Initialize the class
document.addEventListener('DOMContentLoaded', () => {
    new PropertyManager();
});

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
/**
 * SPOTHOUSE CORE LOGIC
 * This script handles the communication between the Tenant and Landlord
 * using the browser's localStorage as a temporary database.
 */

// 1. TENANT SIDE: SAVING THE APPLICATION
// We look for the application form on the Tenant page
const rentForm = document.getElementById('rent-application-form');

if (rentForm) {
    rentForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the page from refreshing immediately

        // Create an object to hold the tenant's data
        const applicationData = {
            id: Date.now(), // Unique ID based on time
            tenantName: document.querySelector('input[placeholder*="Derick"]').value,
            tenantEmail: document.querySelector('input[type="email"]').value,
            property: "Luxury Villa", // This could be dynamic based on the listing clicked
            status: "Pending",        // Default status is always Pending
            appliedAt: new Date().toLocaleDateString()
        };

        // Get existing applications from storage, or start an empty list
        let allApplications = JSON.parse(localStorage.getItem('spothouse_bookings')) || [];
        
        // Add the new application to the list
        allApplications.push(applicationData);

        // Save the updated list back to the browser storage
        localStorage.setItem('spothouse_bookings', JSON.stringify(allApplications));

        alert('Success! Your application is now visible to the Landlord.');
        window.location.href = 'dashbord.html'; // Redirect to see the status
    });
}

// 2. LANDLORD SIDE: APPROVING THE BOOKING
// This function runs on the Dashboard or Landlord page to show the requests
function renderLandlordDashboard() {
    const listContainer = document.getElementById('image-preview-grid');
    if (!listContainer) return;

    const apps = JSON.parse(localStorage.getItem('spothouse_bookings')) || [];

    // Map through applications and create HTML for each
    listContainer.innerHTML = apps.map((app, index) => `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="font-bold text-slate-800">${app.tenantName}</h3>
                    <p class="text-xs text-slate-500">Applied for: ${app.property}</p>
                </div>
                <span class="text-[10px] font-bold px-2 py-1 rounded ${
                    app.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-600'
                }">
                    ${app.status.toUpperCase()}
                </span>
            </div>

            ${app.status === 'Pending' ? `
                <button onclick="changeStatus(${index}, 'Approved')" 
                        class="mt-4 w-full bg-slate-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-amber-500 transition">
                    Approve Application
                </button>
            ` : `<p class="mt-4 text-[10px] text-green-600 font-bold"><i class="fas fa-check-circle"></i> Tenant Notified</p>`}
        </div>
    `).join('');
}

// This function updates the status and "sends" it back to the tenant's view
window.changeStatus = function(index, newStatus) {
    // 1.how get the data from local storage
    let apps = JSON.parse(localStorage.getItem('spothouse_bookings'));
    
    // 2. Change the status of the specific application
    apps[index].status = newStatus;
    
    // 3. Save it back to storage
    localStorage.setItem('spothouse_bookings', JSON.stringify(apps));
    
    // 4. Refresh the UI to show the update
    renderLandlordDashboard();
    
    alert(`Tenant ${apps[index].tenantName} has been approved!`);
};

// Initialize the dashboard view if the element exists on the current page
document.addEventListener('DOMContentLoaded', renderLandlordDashboard);
