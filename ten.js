let allProperties = [];

async function fetchProperties() {
    try {
        const savedData = localStorage.getItem('managedProperties');
        
        if (savedData) {
            allProperties = JSON.parse(savedData);
        } else {
            const response = await fetch('properties.json');
            const rawData = await response.json();
            
            // Initialize all as vacant if not specified
            allProperties = rawData.map(house => ({
                ...house,
                status: house.status || 'vacant',
                tenant: house.tenant || null
            }));
            
            localStorage.setItem('managedProperties', JSON.stringify(allProperties));
        }

        render();
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

function render() {
    const grid = document.getElementById('tenantGrid');
    if (!grid) return;
    grid.innerHTML = '';

    allProperties.forEach(house => {
        const isBooked = house.status === 'booked';
        const card = document.createElement('div');
        
        // APPLY BLUR AND POINTER EVENTS: 
        // If booked, we add 'grayscale blur-sm' and 'pointer-events-none'
        card.className = `relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all 
            ${isBooked ? 'opacity-60 grayscale blur-[2px] pointer-events-none' : 'hover:shadow-md'}`;

        card.innerHTML = `
            <div class="h-48 overflow-hidden relative">
                <img src="${house.image}" alt="${house.name}" 
                     onerror="this.src='https://via.placeholder.com/400x300?text=Property+Image'"
                     class="w-full h-full object-cover">
                
                <div class="absolute top-3 left-3">
                    <span class="${isBooked ? 'bg-red-600' : 'bg-emerald-500'} text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                        ${isBooked ? 'SOLD / BOOKED' : 'Available'}
                    </span>
                </div>
            </div>
            
            <div class="p-5">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-bold text-slate-800 text-lg">${house.name}</h3>
                    <span class="text-emerald-600 font-bold">Ksh ${house.price.toLocaleString()}</span>
                </div>
                
                <p class="text-xs text-slate-400 mb-3 uppercase font-semibold">
                    ${house.location} • ${house.standard}
                </p>

                <button 
                    ${isBooked ? 'disabled' : `onclick="bookAndPay(${house.id})"`}
                    class="w-full py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors
                    ${isBooked 
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                        : 'bg-slate-700 text-white hover:bg-amber-500'}">
                    ${isBooked ? 'House Unavailable' : 'Pay & Book Now'}
                </button>
            </div>

            ${isBooked ? `
                <div class="absolute inset-0 flex items-center justify-center z-10">
                    <div class="bg-red-600 text-white px-4 py-2 rounded-lg font-black text-xl rotate-12 shadow-xl border-2 border-white">
                        BOOKED
                    </div>
                </div>
            ` : ''}
        `;
        grid.appendChild(card);
    });
}

function bookAndPay(id) {
    const houseIndex = allProperties.findIndex(h => h.id === id);
    if (allProperties[houseIndex].status === 'booked') return; // Double check

    const house = allProperties[houseIndex];
    const confirmed = confirm(`Proceed to pay Ksh ${house.price.toLocaleString()} for ${house.name}?`);

    if (confirmed) {
        allProperties[houseIndex].status = 'booked';
        allProperties[houseIndex].tenant = "Online Booking";

        // Save to localStorage so Admin sees it reflected
        localStorage.setItem('managedProperties', JSON.stringify(allProperties));

        alert("Payment Successful! The house is now marked as booked.");
        render(); // Re-render to apply the blur
    }
}

document.addEventListener('DOMContentLoaded', fetchProperties);