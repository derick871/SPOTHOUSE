document.addEventListener('DOMContentLoaded', () => {
    const payButtons = document.querySelectorAll('.payment-btn');
    const formContainer = document.getElementById('payment-fields'); // Ensure this ID exists in your HTML

    payButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Styling Toggle
            payButtons.forEach(b => b.classList.replace('border-slate-900', 'border-gray-100'));
            payButtons.forEach(b => b.classList.remove('bg-slate-50'));
            
            btn.classList.replace('border-gray-100', 'border-slate-900');
            btn.classList.add('bg-slate-50');

            const method = btn.querySelector('span').innerText.toLowerCase();
            updateFormUI(method);
        });
    });

    function updateFormUI(method) {
        let html = '';
        if (method === 'm-pesa') {
            html = `
                <div class="animate-fade-in">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">M-Pesa Number</label>
                    <input type="text" id="phone" class="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="0700 000 000">
                </div>`;
        } else if (method === 'card') {
            html = `
                <div class="animate-fade-in">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                    <input type="text" id="card-num" class="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="1234 5678 9101">
                </div>`;
        } else if (method === 'bank') {
            html = `
                <div class="animate-fade-in">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Account Number</label>
                    <input type="text" id="bank-acc" class="w-full border border-gray-300 rounded-lg px-4 py-3" placeholder="987654321">
                </div>`;
        }
        
        // Add the generic Pay button at the bottom
        formContainer.innerHTML = html + `
            <div class="pt-6">
                <button type="button" onclick="makePayment()" class="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg">
                    Confirm Payment
                </button>
            </div>`;
    }
});

// 3. Payment Submission & Dashboard Update
async function makePayment() {
    // 1. Logic to determine which method is active
    const method = document.getElementById('phone') ? 'M-Pesa' : 
                   document.getElementById('card-num') ? 'Card' : 'Bank';
    
    // Get general data (ensure these IDs exist on your static inputs)
    const amountVal = parseFloat(document.getElementById('amount-input')?.value || 0);
    const tenantVal = document.getElementById('tenant-input')?.value || "Anonymous";

    const paymentData = {
        id: `TXN-${Date.now()}`,
        amount: amountVal,
        tenantName: tenantVal,
        method: method,
        status: 'success',
        timestamp: new Date().toISOString()
    };

    try {
        // Post the transaction
        await fetch('http://localhost:5503/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });

        // Update Dashboard Revenue
        const dashRes = await fetch('http://localhost:5503/dashboard');
        const dashData = await dashRes.json();
        
        // Safety check if dashboard is an array or object
        const currentData = Array.isArray(dashData) ? dashData[0] : dashData;
        currentData.revenue = (parseFloat(currentData.revenue) || 0) + amountVal;
        
        const url = Array.isArray(dashData) ? `http://localhost:5503/dashboard/${currentData.id}` : 'http://localhost:5503/dashboard';

        await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentData)
        });

        alert(`Payment via ${method} successful!`);
        window.location.href = "dashbord.html"; 

    } catch (error) {
        console.error("Failed to sync:", error);
    }
}
