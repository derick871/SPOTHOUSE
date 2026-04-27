// ================= GLOBAL STATE =================
let allProperties = [];
let currentRole = 'admin'; // 'admin' or 'tenant'

// ================= DATA INITIALIZATION =================

async function fetchProperties() {
    try {
        const response = await fetch('properties.json');
        allProperties = await response.json();
        render();
    } catch (error) {
        console.error('Error loading properties:', error);
        const grid = document.getElementById('houseGrid');
        if (grid) grid.innerHTML = `<p class="col-span-full text-center text-red-500">Failed to load property data.</p>`;
    }
}

// ================= UI RENDERING LOGIC =================

function render() {
    const grid = document.getElementById('houseGrid');
    const viewTitle = document.getElementById('viewTitle');
    if (!grid) return;

    grid.innerHTML = '';

    // Set Header Title
    if (viewTitle) {
        viewTitle.innerText = currentRole === 'admin' ? "Admin: Property Management" : "Available Rentals";
    }

    // Filter and Display
    allProperties.forEach(house => {
        const isBooked = house.status === 'booked' || house.booked === true;

        // Tenants only see available houses
        if (currentRole === 'tenant' && isBooked) return;

        const card = document.createElement('div');
        card.className = `bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all ${isBooked ? 'opacity-75 border-red-200' : 'hover:shadow-md'}`;

        card.innerHTML = `
            <div class="relative h-44 overflow-hidden">
                <img src="${house.image}" alt="${house.name}" 
                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'"
                     class="w-full h-full object-cover">
                <div class="absolute top-2 right-2">
                    <span class="${isBooked ? 'bg-red-500' : 'bg-emerald-500'} text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase">
                        ${isBooked ? 'Booked' : 'Available'}
                    </span>
                </div>
            </div>
            <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-slate-800 text-lg truncate">${house.name || house.title}</h4>
                    <span class="text-emerald-600 font-bold">Ksh ${house.price.toLocaleString()}</span>
                </div>
                
                ${isBooked && currentRole === 'admin' ? `
                    <div class="bg-red-50 p-2 rounded mb-4">
                        <p class="text-[10px] text-red-400 font-bold uppercase">Current Tenant</p>
                        <p class="text-sm text-slate-700 font-semibold">${house.tenant || 'Occupied'}</p>
                    </div>
                ` : ''}

                ${currentRole === 'tenant' ? `
                    <button 
                        onclick="processBooking(${house.id})"
                        ${isBooked ? 'disabled' : ''}
                        class="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all
                        ${isBooked 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                            : 'bg-slate-900 text-white hover:bg-amber-600'}">
                        ${isBooked ? 'House Taken' : 'Confirm & Pay Now'}
                    </button>
                ` : ''}

                ${currentRole === 'admin' ? `
                    <div class="mt-3 pt-3 border-t border-slate-100 flex gap-2">
                        <button onclick="editProperty(${house.id})" class="flex-1 text-[10px] font-bold py-1 bg-slate-50 rounded hover:bg-slate-200 transition-colors">EDIT</button>
                        <button onclick="removeProperty(${house.id})" class="flex-1 text-[10px] font-bold py-1 bg-red-50 text-red-500 rounded hover:bg-red-100 transition-colors">REMOVE</button>
                    </div>
                ` : ''}
            </div>
        `;
        grid.appendChild(card);
    });

    updateStats();
}

// ================= BUSINESS LOGIC =================

function updateStats() {
    const statsContainer = document.getElementById('statsContainer'); // Assuming you have a wrapper for stats
    
    // HIDE STATS FROM TENANTS
    if (currentRole === 'tenant') {
        if (statsContainer) statsContainer.classList.add('hidden');
        return; 
    } else {
        if (statsContainer) statsContainer.classList.remove('hidden');
    }

    const bookedUnits = allProperties.filter(h => h.status === 'booked');
    const revenue = bookedUnits.reduce((sum, h) => sum + h.price, 0);

    const revEl = document.getElementById('totalRevenue');
    const occEl = document.getElementById('occupiedCount');
    const tenEl = document.getElementById('tenantCount');

    if (revEl) revEl.innerText = `Ksh ${revenue.toLocaleString()}`;
    if (occEl) occEl.innerText = allProperties.length;
    if (tenEl) tenEl.innerText = bookedUnits.length;
}

// ... rest of your authenticate, processBooking, and DashboardSync code remains the same