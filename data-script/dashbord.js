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

    // Loop through every house in our list
    allProperties.forEach(house => {
        // Determine if the house is taken (checks for 'booked' status in JSON)
        const isBooked = house.status === 'booked' || house.booked === true;

        // --- SECURITY/PRIVACY FILTER ---
        // If we are in 'tenant' view AND the house is booked, we 'return' (skip this house).
        // This effectively hides taken houses from the public view.
       /// if (currentView === 'tenant' && isBooked) {
           // return; 
       // }

        // Create a new container for the house card
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

