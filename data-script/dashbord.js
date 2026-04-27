let allProperties = [];

async function fetchAdminData() {
    try {
        const response = await fetch('properties.json');
        const data = await response.json();
        
        // Ensure every property has a status if missing in JSON
        allProperties = data.map(p => ({
            ...p,
            status: p.status || 'vacant', // Default to vacant if not specified
            tenant: p.tenant || 'None'
        }));
        
        renderAdminDashboard();
        updateAdminStats();
    } catch (error) {
        console.error("Error fetching data for Admin:", error);
    }
}

function updateAdminStats() {
    // 1. Total Revenue (Sum of booked properties)
    const revenue = allProperties
        .filter(h => h.status === 'booked')
        .reduce((sum, h) => sum + h.price, 0);

    // 2. Units Available - Showing TOTAL number of houses in JSON
    const totalUnits = allProperties.length;

    // 3. Active Tenants (Count of booked properties)
    const active = allProperties.filter(h => h.status === 'booked').length;

    document.getElementById('totalRevenue').innerText = `Ksh ${revenue.toLocaleString()}`;
    document.getElementById('unitsAvailable').innerText = totalUnits; // Shows total count
    document.getElementById('activeTenants').innerText = active;
}

function renderAdminDashboard() {
    const grid = document.getElementById('adminGrid');
    if (!grid) return;
    grid.innerHTML = '';

    allProperties.forEach(house => {
        const isBooked = house.status === 'booked';
        const card = document.createElement('div');
        card.className = `p-4 border rounded-xl bg-white transition-all ${isBooked ? 'border-red-200 shadow-inner' : 'border-slate-200 shadow-sm'}`;

        card.innerHTML = `
            <img src="${house.image}" class="w-full h-32 object-cover rounded-lg mb-3" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            <h3 class="font-bold text-slate-800">${house.name}</h3>
            <p class="text-xs text-slate-500">${house.location} | ${house.standard}</p>
            <p class="text-sm font-bold text-emerald-600 mt-1">Ksh ${house.price.toLocaleString()}</p>
            
            <div class="mt-2 py-1 px-2 inline-block rounded text-[10px] font-bold uppercase ${isBooked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}">
                ${house.status}
            </div>
            
            ${isBooked ? `<p class="text-[11px] mt-2 text-slate-600 italic">Tenant: ${house.tenant}</p>` : ''}
            
            <div class="flex gap-2 mt-4">
                <button onclick="editProperty(${house.id})" class="flex-1 text-xs py-1 bg-slate-800 text-white rounded hover:bg-slate-700">Edit</button>
                <button onclick="deleteProperty(${house.id})" class="flex-1 text-xs py-1 bg-red-50 text-red-500 rounded border border-red-100 hover:bg-red-100">Delete</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ================= FUNCTIONAL BUTTONS =================

// 1. DELETE FUNCTION
function deleteProperty(id) {
    if (confirm("Are you sure you want to delete this property?")) {
        // Filter out the property with the matching ID
        allProperties = allProperties.filter(house => house.id !== id);
        
        // Refresh UI and Stats
        renderAdminDashboard();
        updateAdminStats();
    }
}

// 2. EDIT FUNCTION
function editProperty(id) {
    // Find the property in the array
    const houseIndex = allProperties.findIndex(h => h.id === id);
    const house = allProperties[houseIndex];

    // Simple prompt-based editing
    const newName = prompt("Edit Property Name:", house.name);
    const newPrice = prompt("Edit Price (Numbers only):", house.price);
    const newStatus = prompt("Edit Status (vacant/booked):", house.status);

    if (newName && newPrice) {
        // Update the object in the array
        allProperties[houseIndex].name = newName;
        allProperties[houseIndex].price = parseInt(newPrice);
        allProperties[houseIndex].status = newStatus.toLowerCase();

        // Refresh UI and Stats
        renderAdminDashboard();
        updateAdminStats();
    }
}

document.addEventListener('DOMContentLoaded', fetchAdminData);