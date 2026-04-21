function filterhouse (){
    const location =getElementById('location,');
    const priceRange= getElementById(price);

    document.querySelectorAll('proparty card').forEach(card => {
        const matchLocation=location=== 'All' ||card.setData.location ===
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
}
