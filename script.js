const contact = document.getElementById('contact');
contact.addEventListener('click', function() {
    alert('You clicked the contact section!');
});

const applicationForm = document.getElementById('application-form');
applicationForm.addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Application form submitted!');
});
const name = document.getElementById('tenant-contact').value;
const message = document.getElementById('message-form').value;
console.log(`sending message from ${name}: ${message}`);

const feedback = document.getElementById('feedback-message');
feedback.textContent = 'Message sent successfully!';
async function booking(title, standard, price, location) {
    const response = await fetch('https://jsonwww.originhomes.co.ke', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ houseid, standard, price, location, })
    });
    const data = await response.json();
    return data;
}
if(overlappingbooking) {
    alert('This house is already booked. Please choose different house.');
} else {
    const bookingResult = await booking(houseid, standard, price, location);
    if (bookingResult.success) {
        alert('House booked successfully!');
    }
}