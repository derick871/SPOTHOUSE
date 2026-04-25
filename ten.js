 const currentView= 'tenants';
 // ================= GLOBAL STATE =================
// 'allProperties' acts as a temporary database in the browser's memory.
let allProperties = []; 

// This variable is set in the HTML file to determine if we show the Admin or Tenant view.
// currentView = 'admin' or 'tenant'

// ================= FETCHING DATA =================

/**
 * Connects to your local JSON file and loads the house data.
 */
async function fetchProperties() {
    try {
        // Step 1: Request the properties.json file from the server.
        const response = await fetch('properties.json');
        
        // Step 2: Convert the file content into a JavaScript array we can manipulate.
        allProperties = await response.json();
        
        // Step 3: Trigger the render function to display the houses on the screen.
        render();
    } catch (error) {
        // Log an error if the JSON file is missing or the server isn't running.
        console.error("Fetch error", error);
    }
}

// ================= UI RENDERING =================

/**
 * Logic to build the visual cards for the houses.
 */
function render() {
    // Locate the container in the HTML where houses will be displayed.
    const grid = document.getElementById('houseGrid');
    if (!grid) return; // Exit if the container doesn't exist.
    // Inside the render() loop:
const bookingBtn = `
    <button 
        onclick="bookHouse(${house.id})" 
        class="w-full py-3 bg-slate-900 hover:bg-amber-600 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg">
        <i class="fa-solid fa-credit-card mr-2"></i> Confirm & Book
    </button>
`;
    
    grid.innerHTML = ''; // Clear the grid to prevent duplicating cards on refresh.

    allProperties.forEach(house => {
        // Boolean check: returns true if the house is already taken.
        const isBooked = house.status === 'booked';

        // --- FILTERING LOGIC ---
        // If the user is a Tenant and the house is booked, we 'return' (skip it).
        // This is why booked houses "disappear" for tenants.
        if (currentView === 'tenant' && isBooked) return;

        // Create the HTML element for the card.
        const card = document.createElement('div');
        card.className = "bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200";
        
        card.innerHTML = `
            <img src="${house.image}" class="w-full h-40 object-cover">
            
            <div class="p-4">
                <h4 class="font-bold text-slate-800">${house.name}</h4>
                <p class="text-emerald-600 font-bold mb-4">Ksh ${house.price.toLocaleString()}</p>
                
                ${isBooked && currentView === 'admin' ? 
                    `<p class="text-xs bg-slate-100 p-2 rounded mb-2">Occupant: ${house.tenant}</p>` : ''}

                <button 
                    onclick="bookHouse(${house.id})" 
                    ${isBooked ? 'disabled' : ''}
                    class="w-full py-2 rounded font-bold text-xs uppercase transition-all 
                    ${isBooked ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-amber-600'}">
                    ${isBooked ? 'Occupied' : 'Book & Pay Now'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });

    // Update the dashboard numbers (Revenue, Tenants) if we are on the Admin page.
    updateStats();
}

// ================= BOOKING ACTION =================

/**
 * Handles the logic when a tenant clicks the 'Book Now' button.
 */
function bookHouse(houseId) {
    // Find the specific house object in our array using its unique ID.
    const house = allProperties.find(h => h.id === houseId);

    // Prompt the user for their name (Simulating a booking form).
    const tenantName = prompt(`Confirm booking for ${house.name}?\nEnter your name:`);

    // Validation: Only proceed if a name was actually entered.
    if (tenantName && tenantName.trim() !== "") {
        // Change the status in the local array to 'booked'.
        house.status = 'booked';
        // Assign the name entered to the 'tenant' property of the house.
        house.tenant = tenantName;

        alert("Unit booked successfully!");
        
        // Re-run the render function. 
        // If currentView is 'tenant', this house will now fail the filter check and disappear.
        render(); 
    }
}

// ================= ADMIN STATS =================

/**
 * Calculates the total money and count of active tenants.
 */
function updateStats() {
    const revenueEl = document.getElementById('totalRevenue');
    // If the revenue element isn't on the page (like on tenant.html), stop here.
    if (!revenueEl) return; 

    // Create a sub-list of only houses that are booked.
    const booked = allProperties.filter(h => h.status === 'booked');
    
    // Add up the 'price' property of every booked house starting from 0.
    const revenue = booked.reduce((sum, h) => sum + h.price, 0);

    // Display the results in the Admin dashboard.
    revenueEl.innerText = `Ksh ${revenue.toLocaleString()}`;
    document.getElementById('occupiedCount').innerText = allProperties.length;
    document.getElementById('tenantCount').innerText = booked.length;
}

// Automatically start the fetch process when the page finishes loading.
fetchProperties();