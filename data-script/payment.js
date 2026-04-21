document.addEventListener('DOMContentLoaded', () => {
    const payButtons = document.querySelectorAll('div.flex.gap-4.mb-8 button');
    const formContainer = document.querySelector('form');
    const submitBtn = document.querySelector('button[onclick="makepayment()"]');

    // 1. Handle Payment Method Switching
    payButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active style from all buttons
            payButtons.forEach(b => {
                b.classList.remove('border-slate-900', 'bg-slate-50');
                b.classList.add('border-gray-100');
            });

            // Add active style to clicked button
            btn.classList.add('border-slate-900', 'bg-slate-50');
            btn.classList.remove('border-gray-100');

            const method = btn.querySelector('span').innerText.toLowerCase();
            updateFormUI(method);
        });
    });

    // 2. Dynamic UI Update (payment)
    function updateFormUI(method) {
        if (method === 'm-pesa') {
            formContainer.innerHTML = `
                <div class="animate-fade-in">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">M-Pesa Phone Number</label>
                    <input type="text" id="phone" class="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-slate-900" placeholder="0700 000 000">
                    <p class="text-[10px] text-gray-400 mt-2">You will receive an STK Push on your phone.</p>
                </div>
                <div class="pt-6">
                    <button type="button" id="process-payment" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition transform active:scale-95">
                        Pay with M-Pesa
                    </button>
                </div>
            `;
        } else if (method === 'card') {
             location.reload(); // Simplest way to revert to default card HTML
        }
        // Add listener back to the new dynamic button
        document.getElementById('process-payment')?.addEventListener('click', makePayment);
    }

    // 3. AJAX Payment Submission
    window.makePayment = async function() {
    const paymentData = {
        id: `TXN-${Date.now()}`,
        amount: "",
        tenantName: "", // Get this from your form
        property: "",
        method: document.getElementById('phone') ? 'M-Pesa' : 'Card',
        status: 'success',
        timestamp: new Date().toISOString()
    };

    try {
        // 1. Record the payment in the payments history
        await fetch('http://localhost:5503/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        });

        // fetch current dashboard data and add the new amount
        const dashRes = await fetch('http://localhost:5503/dashboard');
        const dashData = await dashRes.json();
        
        new payment=dashData.revenue += paymentData.amount; 
        
        await fetch('http://localhost:5503/dashboard', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dashData)
        });

        alert("Payment Received! Dashboard Updated.");
        window.location.href = "dashbord.html"; // Redirect to see the result

    } catch (error) {
        console.error("Payment failed to sync:", error);
    }
};
});
