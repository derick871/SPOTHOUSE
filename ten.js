let allProperties = [];
let availableHouses = [];

async function fetchAvailableHouses() {
    try {
        // 1. Check if we have modified data in localStorage first
        const savedData = localStorage.getItem('managedProperties');
        
        if (savedData) {
            allProperties = JSON.parse(savedData);
        } else {
            // 2. Otherwise fetch from original JSON
            const response = await fetch('properties.json');
            allProperties = await response.json();
            // Initialize local storage for the first time
            localStorage.setItem('managedProperties', JSON.stringify(allProperties));
        }

        // LOGIC: Filter only vacant houses for the Tenant
        availableHouses = allProperties.filter(house => house.status === 'vacant');
        render();
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

function bookAndPay(id) {
    const houseIndex = allProperties.findIndex(h => h.id === id);
    const house = allProperties[houseIndex];
    
    const confirmed = confirm(`Proceed to pay Ksh ${house.price.toLocaleString()} for ${house.name}?`);

    if (confirmed) {
        // Update the status in our main array
        allProperties[houseIndex].status = 'booked';
        allProperties[houseIndex].tenant = "Recent Online Booking";

        // SAVE to localStorage so Admin Dashboard can see it
        localStorage.setItem('managedProperties', JSON.stringify(allProperties));

        alert("Payment Successful! The Admin dashboard has been updated.");
        
        // Refresh the tenant view (house will disappear from available list)
        availableHouses = allProperties.filter(h => h.status === 'vacant');
        render();
    }
}
// Rest of your render() function remains the same...