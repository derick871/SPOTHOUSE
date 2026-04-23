// ================= GLOBAL STATE =================
let allProperties = [];
let currentView = 'tenant';

// ================= FETCH DATA =================
async function fetchProperties() {
    try {
        const response = await fetch('properties.json');

        if (!response.ok) {
            throw new Error('Failed to fetch properties');
        }

        const data = await response.json();

        // Fix: Use a declared variable
        const properties = data.response || data;
        console.log("Data loaded:", properties);
        allProperties = properties;

        renderPropertyGrid(allProperties);
        updateStats(allProperties);

    } catch (error) {
        console.error('Error loading properties:', error);

        const grid = document.getElementById('houseGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-10">
                    <p class="text-red-500">Error loading properties. Make sure you are running on a local server.</p>
                </div>
            `;
        }
    }
}

// ================= RENDER GRID =================
function renderPropertyGrid(properties) {
    const grid = document.getElementById('houseGrid');
    if (!grid) return;

    if (!properties || properties.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-10">
                <p class="text-slate-500">No properties available</p>
            </div>
        `;
        return;
    }
    
    const htmlCards = properties.map(house => `
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all group">
            <div class="relative h-40 overflow-hidden">
                <img src="${house.image || 'fallback.jpg'}" 
                     alt="${house.title}" 
                     onerror="this.src='fallback.jpg'"
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                
                <div class="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">
                    ${house.location || 'Unknown'}
                </div>
            </div>

            <div class="p-5">
                <div class="mb-4">
                    <h4 class="font-bold text-slate-800 text-lg truncate">
                        ${house.title || 'No Title'}
                    </h4>
                    <p class="text-xs text-slate-500">
                        ${house.specs || ''}
                    </p>
                </div>

                <div class="flex items-center justify-between mb-4">
                    <span class="text-lg font-extrabold text-slate-900">
                        ${house.currency || 'Ksh'} ${(house.price || 0).toLocaleString()}
                    </span>
                    <span class="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-400 uppercase">
                        /${house.period || 'month'}
                    </span>
                </div>

                <a href="payment.html?id=${house.id}" 
                   class="block text-center w-full py-2 bg-slate-900 hover:bg-amber-600 text-white text-xs font-bold rounded-lg uppercase tracking-widest">
                    Manage / Pay
                </a>
            </div>
        </div>
    `).join('');

    grid.innerHTML = htmlCards;
}

// ================= STATS =================
function updateStats(properties) {
    const totalRevenue = properties.reduce(
        (sum, item) => sum + (Number(item.price) || 0),
        0
    );

    const revenueEl = document.getElementById('totalRevenue');
    const occupiedEl = document.getElementById('occupiedCount');
    const tenantEl = document.getElementById('tenantCount');

    // Fix: Wrapped in backticks
    if (revenueEl) {
        revenueEl.innerText =` Ksh ${totalRevenue.toLocaleString()}`;
    }

    if (occupiedEl) occupiedEl.innerText = properties.length;
    if (tenantEl) tenantEl.innerText = properties.length;
}

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    fetchProperties();
})