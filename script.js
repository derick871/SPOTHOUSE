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



  function makePayment() {
    url="https://flutterwave.com"
    FlutterwaveCheckout({
      tx_ref: "SPOTHOUSE-" + Date.now(), // Unique transaction reference
      amount: 92500, // Total amount from summary
      currency: "KES",
      payment_options: "card, mpesa, ussd",
      customer: {
        email: "wamyamaderrick4@gmail.com",
        phone_number: "0745668544",
        name: "Derrick Wamyama",
      },
      customizations: {
        title: "Spothouse Rentals",
        description: "Payment for Luxury Villa - Kisumu",
        logo: "https://your-domain.com",
      },
      callback: function (data) {
        console.log("Payment successful!", data);
        alert("Payment Successful! Ref: " + data.transaction_id);
        // Here you would typically redirect to a success page
      },
      onclose: function() {
        // Handle what happens when the modal is closed
        console.log("Payment cancelled.");
      }
    });
  }

  document.addEventListener(`('DOMcontents loaded',) => {
    const navbar =document.getElementById('navbar')`);
    //scroll effect
    window.addEventListener(scroll () => {
        if(window scrollY > 30){
            navbar.classList.add();
        }
        else{
            navbar.classList.remove();
        } 
    });
  }
     // Mobile Menu Toggle (if you have one)
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            document.querySelector('.mobile-menu').classList.toggle('hidden');
        });
    }
});

function filterhouse (){
    const location =getElementById(location);
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
document.addEventListener('DOMContentLoaded',() =>
async function refreshdashbord (){
    let url= 'https://houselink360.com'
    try{
        const response= await fetch(url);

        const data =await response.json();
    }
    document.
})


