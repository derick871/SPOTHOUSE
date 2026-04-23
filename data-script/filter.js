function filterhouse() {
    // 1. Get current values from the dropdowns/inputs
    const selectedLocation = document.getElementById('location').value;
    const maxPrice = parseFloat(document.getElementById('price').value) || Infinity;

    // 2. Loop through every property card
    document.querySelectorAll('.property-card').forEach(card => {
        // Access data-location and data-price from the HTML
        const cardLocation = card.dataset.location;
        const cardPrice = parseFloat(card.dataset.price);

        // 3. Define the matching logic
        const matchLocation = selectedLocation === 'All' || cardLocation === selectedLocation;
        const matchPrice = isNaN(cardPrice) || cardPrice <= maxPrice;

        // 4. Show or hide based on both conditions
        if (matchLocation && matchPrice) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
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
    console.log(data)
}

//function fetch and display dashbord data

     //updates
     async function refreshDashboard() {
    let url = 'http://localhost:5503/dashboard';
    try {
        const response = await fetch();
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
    console.log(data)

}
