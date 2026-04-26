// ================= GLOBAL STATE =================
// This array will hold the objects fetched from your properties.json
let allProperties = [];

// Tracks which dashboard is active: 'admin' (sees everything) or 'tenant' (sees only available)
let currentView = 'admin'; 

// ================= DATA INITIALIZATION =================

/**
 * Fetches data from properties.json.
 * This must be run on a local server (like Live Server) because browsers
 * block 'fetch' requests to local files for security.
 */
async function fetchProperties() {
    try {
        // Step 1: Request the file
        const response = await fetch('properties.json');
        
        // Step 2: Convert the raw response into a JavaScript object/array
        const data = await response.json();
        
        // Step 3: Store the data in our global variable for use in other functions
        allProperties = data;

        // Step 4: Run the first render to draw the UI
        render();
    } catch (error) {
        console.error('Error loading properties:', error);
        // Inform the user if the JSON failed to load
        document.getElementById('houseGrid').innerHTML = `
            <p class="col-span-full text-center text-red-500">Failed to load property data.</p>
        `;
    }
}

// ================= UI RENDERING LOGIC =================

/**
 * The core function that draws the property cards.
 * It clears the grid and rebuilds it based on the currentView and house status.
 */
function render() {
    const grid = document.getElementById('houseGrid');
    const viewTitle = document.getElementById('viewTitle');
    
    if (!grid) return;
    grid.innerHTML = ''; // Clear existing cards before re-drawing

    // Dynamic Title: Changes based on which button was clicked
    viewTitle.innerText = currentView === 'admin' ? "Admin: Property Management" : "Available Rentals";
    viewTitle.innerText = currentView === 'tenants' ? " tenants: check available  houses" : "Available Huoses";

    // Loop through every house in our list
    allProperties.forEach(house => {
        // Determine if the house is taken (checks for 'booked' status in JSON)
        const isBooked = house.status === 'booked' || house.booked === true;

        // --- SECURITY/PRIVACY FILTER ---
        //  hides taken houses from the public view.
          if (currentView === 'tenant' && isBooked) {
            return; 
        }

        // Create container for the house card
        const card = document.createElement('div');
        // Apply conditional styling: Booked houses look slightly transparent (opacity-75)
        card.className = `bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all ${isBooked ? 'opacity-75 border-red-200' : 'hover:shadow-md'}`;

        card.innerHTML = `
            <div class="relative h-44 overflow-hidden">
                <img src="${house.image}" alt="${house.name}" 
                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'"
                     class="w-full h-full object-cover">
                
                <div class="absolute top-2 right-2">
                    <span class="${isBooked ? 'bg-red-500' : 'bg-emerald-500'} text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase shadow-lg">
                        ${isBooked ? 'Booked' : 'Available'}
                    </span>
                </div>
            </div>

            <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-slate-800 text-lg truncate">${house.title}</h4>
                    <span class="text-emerald-600 font-bold">Ksh ${house.price.toLocaleString()}</span>
                </div>
                
                ${isBooked && currentView === 'admin' ? `
                    <div class="bg-red-50 p-2 rounded mb-4">
                        <p class="text-[10px] text-red-400 font-bold uppercase">Current Tenant</p>
                        <p class="text-sm text-slate-700 font-semibold">${house.tenant || 'Occupied'}</p>
                    </div>
                ` : ''}

                <button 
                    onclick="${isBooked ? '' : `processBooking(${house.id})`}"
                    ${isBooked ? 'disabled' : ''}
                    class="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all
                    ${isBooked 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                        : 'bg-slate-900 text-white hover:bg-amber-600'}">
                    ${isBooked ? 'House Taken' : 'Book & Pay Now'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Update the three stat cards at the top
    updateStats();
}

// ================= BUSINESS LOGIC =================

/**
 * Calculates revenue and tenant counts based on the 'booked' status.
 */
function updateStats() {
    // Filter out only the houses that are booked
    const bookedUnits = allProperties.filter(h => h.status === 'booked' || h.booked === true);
    
    // Add up the prices of all booked houses
    const revenue = bookedUnits.reduce((sum, h) => sum + h.price, 0);

    // Inject values into the HTML IDs
    document.getElementById('totalRevenue').innerText = `Ksh ${revenue.toLocaleString()}`;
    document.getElementById('occupiedCount').innerText = allProperties.length;
    document.getElementById('tenantCount').innerText = bookedUnits.length;
}

/**
 * Switches between Admin and Tenant views and re-renders.
 */
function toggleView(view) {
    currentView = view;
    render();
}

/**
 * Simple booking simulation.
 * In a real app, this would send a request to a server/database.
 */
function processBooking(id) {
    const house = allProperties.find(h => h.id === id);
    const tenantName = prompt(`Enter Tenant Name for ${house.name}:`);
    
    if (tenantName) {
        // Update local state
        house.status = 'booked';
        house.title ='title';
        house.tenant = tenantName;
        // Refresh UI to reflect changes (the house will vanish if in Tenant view)
        render(); 
    }
}

// Kick off the application once the script loads
document.addEventListener('DOMContentLoaded', fetchProperties);
// Initialize
document.addEventListener('DOMContentLoaded', fetchProperties);
// Data representing what the tenant just did
const tenantAction = {
    property: "",
    name: "",
    amount: "",
    status: "",
    date: new Date().toLocaleDateString()
};

// Save it to the browser's shared storage
localStorage.setItem('latestPayment', JSON.stringify(tenantAction));

class DashboardSync {
    constructor() {
        this.tableBody = document.querySelector('tbody');
        this.init();
    }

    init() {
        this.displayData();
        // Listen for changes (if the tenant pays while the admin has the tab open)
        window.addEventListener('storage', () => this.displayData());
    }

    displayData() {
        // 1. Grab the string from storage
        const rawData = localStorage.getItem('latestPayment');
        
        if (!rawData) return; // Exit if no data exists yet

        // 2. Turn the string back into a JavaScript Object
        const data = JSON.parse(rawData);

        // 3. Create the UI row
        const row = document.createElement('tr');
        row.className = "border-b border-slate-100 animate-pulse bg-yellow-50"; // Highlight new entry
        
        row.innerHTML = `
            <td class="px-6 py-4 font-medium">${data.property}</td>
            <td class="px-6 py-4">${data.name}</td>
            <td class="px-6 py-4 font-bold">Ksh ${data.amount.toLocaleString()}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    ${data.status}
                </span>
            </td>
        `;

        // Add to table (prepending so newest is at the top)
        this.tableBody.prepend(row);
    }
}

// Start the admin sync
new DashboardSync();
 // Core Logic for Authentication
        function authenticate(role) {
            // 1. Hide the login card
            document.getElementById('authOverlay').classList.add('hidden');
            
            // 2. Show the main dashboard
            document.getElementById('mainContent').classList.remove('hidden');
            
            // 3. Update the UI based on role
            document.getElementById('currentRole').innerText = role.toUpperCase();
            document.getElementById('viewTitle').innerText = role === 'admin' ? "Admin Dashboard" : "Tenant Listings";

            // 4. Call your existing data loading function from dashbord.js
            // This assumes toggleView is defined in your dashbord.js
            if (typeof toggleView === "function") {
                toggleView(role);
            }
        }

        function logout() {
            // Simple refresh to lock the app again
            window.location.reload();
        }
        function renderHouses(role) {
    const grid = document.getElementById('houseGrid');
    grid.innerHTML = ''; // Clear the "Loading" spinner

    // 1. Filter: Tenants only see 'available' houses. Admins see 'all'.
    const visibleHouses = houses.filter(house => {
        if (role === 'tenants') {
            return house.status !== 'booked'; 
        }
        return true; 
    });

    // 2. Loop through and build the UI
    visibleHouses.forEach(house => {
        // Condition for the button: only visible for tenants
        const payButton = role === 'tenants' 
            ? `<button onclick="processPayment('${house.id}')" class="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                CONFIRM & PAY
               </button>` 
            : ''; // Admin gets an empty string (no button)

        // Status Badge Color Logic
        const badgeColor = house.status === 'booked' ? 'bg-red-500' : 'bg-emerald-500';

        const card = `
            <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100 flex flex-col">
                <div class="relative">
                    <img src="${house.image}" class="w-full h-40 object-cover" alt="house">
                    <span class="absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold uppercase text-white ${badgeColor}">
                        ${house.status}
                    </span>
                </div>
                <div class="p-4 flex-grow">
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold text-slate-800">${house.name}</h4>
                            <p class="text-slate-500 text-xs"><i class="fa-solid fa-location-dot mr-1"></i>${house.location}</p>
                        </div>
                        <p class="text-amber-600 font-bold text-sm">Ksh ${house.price.toLocaleString()}</p>
                    </div>
                    
                    ${payButton} 
                    
                    ${role === 'admin' ? `
                        <div class="mt-4 pt-4 border-t border-slate-50 flex gap-2">
                            <button class="flex-1 bg-slate-100 text-slate-600 text-[10px] font-bold py-1 rounded hover:bg-slate-200">EDIT</button>
                            <button class="flex-1 bg-slate-100 text-red-400 text-[10px] font-bold py-1 rounded hover:bg-red-50">REMOVE</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', card);
    });
}
        

