function showPayment(methodId) {
            // Hide all forms
            document.querySelectorAll('.payment-form').forEach(f => f.classList.remove('active'));
            // Show selected form
            document.getElementById(methodId).classList.add('active');

            // Update button styles
            document.querySelectorAll('.method-btn').forEach(btn => {
                btn.classList.remove('bg-white', 'shadow-sm', 'text-blue-600');
                btn.classList.add('text-gray-600');
            });
            
            const activeBtn = document.getElementById('btn-' + methodId);
            activeBtn.classList.add('bg-white', 'shadow-sm', 'text-blue-600');
            activeBtn.classList.remove('text-gray-600');
        }