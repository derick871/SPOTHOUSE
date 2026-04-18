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
    url= 'https://www.originhomes.co.ke';
    const response = await fetch('https://www.originhomes.co.ke', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, standard, price, location, })
    });
    const data = await response.json();
    return data;
    console.log('Booking data:', data);
}


if(overlappingbooking) {
    alert('This house is already booked. Please choose different house.');
} else {
    const bookingResult = responsebooking(title, standard, price, location);
    if (bookingResult.success) {
        alert('House booked successfully!');
    }
}
responsebooking(title, standard, price, location)
const house =require('url');
const house = new house({
    title: {type: String, required: true},
    standard: {type: String, required: true},
    price: {type: Number, required: true},
    location: {type: String, required: true},
})

.then(response => {
    if (!response.success) {
        throw new Error('Booking failed: ' + response.message);
    }
    return response.json(data);
})
.catch(error => {
    console.error('Error booking house:', error);
});
module.exports = house;
