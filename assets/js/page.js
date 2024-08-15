function scrollToChatbot() {
    var chatbotSection = document.getElementById('chat-container');
    chatbotSection.scrollIntoView({ behavior: 'smooth' });
}
   // Get the modal
   var modal = document.getElementById("myModal");

   // When the page loads or refreshes, display the modal
   window.onload = function() {
       modal.style.display = "block";
   }

   // Validate login credentials
   document.getElementById("loginForm").addEventListener("submit", function(event) {
       event.preventDefault();
       var username = document.getElementById("username").value.trim();
       var password = document.getElementById("password").value.trim();
       
       // Check if username and password are correct (admin/admin in this case)
       if (username === "admin" || username === "nurse" || username === "doctor") {
           modal.style.display = "none";  
           document.querySelector('#admin-part-testimonial').style.display = 'none';         
           createAppointmentsSection();
           listAppointments();
           showToast("Success", "Login successful", "success");
       } else{
       document.querySelector('#admin-part-chat').style.display = 'none';  
       document.querySelector('#chat-container').style.display = 'none';  
       document.querySelector('#admin-part-appointment').style.display = 'none';  
        modal.style.display = "none";
        showToast("Success", "Login successful", "success");
    }
   });

   // Function to handle query submission
   function submitQuery() {
       var query = document.getElementById("query-input").value.trim();
       if (query !== "") {
           document.getElementById("chat-history").innerHTML += `
               <div class="message user">
                   <p>${query}</p>
               </div>
           `;

           document.getElementById("query-input").value = "";

           fetch("/process_query", {
                   method: "POST",
                   headers: {
                       "Content-Type": "application/x-www-form-urlencoded",
                   },
                   body: "query=" + encodeURIComponent(query)
               })
               .then(response => response.json())
               .then(data => {
                   if (Array.isArray(data.response)) {
                       var botResponse = `<div class="message bot">Bot: The list of patients in the database is:</div>`;
                       botResponse += "<ul>";
                       data.response.forEach(patient => {
                           botResponse += "<li>" + patient + "</li>";
                       });
                       botResponse += "</ul>";
                       document.getElementById("chat-history").innerHTML += botResponse;
                   } else {
                       document.getElementById("chat-history").innerHTML += ` <div class="message bot"> ` + data.response + "</div>";
                   }
               })
               .catch(error => {
                   console.error("Error:", error);
               });
       }
   }

   // Function to handle Enter key press
   function handleEnterKey(event) {
       if (event.keyCode === 13) {
           event.preventDefault();
           submitQuery();
       }
   }

   // Function to display toast
   function showToast(title, message, type) {
       var toast = document.getElementById("toast");
       toast.textContent = title + ": " + message;
       toast.className = "toast show " + type;
       setTimeout(function() {
           toast.className = toast.className.replace("show", "");
       }, 3000);
   }

   document.addEventListener('DOMContentLoaded', function() {
    const doctors = [
        { id: 'Dr. John Smith', name: 'Dr. John Smith', specialty: 'Cardiologist' },
        { id: 'Dr. Jane Doe', name: 'Dr. Jane Doe', specialty: 'Dermatologist' },
        { id: 'Dr. Emily Johnson', name: 'Dr. Emily Johnson', specialty: 'Pediatrician' },
        { id: 'Dr. Sonam Eddison', name: 'Dr. Sonam Eddison', specialty: 'General' }
    ];

    const doctorsList = document.getElementById('doctors-list');
    const doctorSelect = document.getElementById('doctorSelect');
    
    doctors.forEach(doctor => {
        // Populate doctor cards
        const doctorCard = document.createElement('div');
        doctorCard.className = 'col-md-4 col-lg-3';
        doctorCard.innerHTML = `
            <div class="doctor-card">
                <div class="body">
                    <h6 class="title">${doctor.name}</h6>
                    <p class="subtitle">${doctor.specialty}</p>
                </div>
            </div>
        `;
        doctorsList.appendChild(doctorCard);

        // Populate doctor select options
        const doctorOption = document.createElement('option');
        doctorOption.value = doctor.id;
        doctorOption.textContent = `${doctor.name} - ${doctor.specialty}`;
        doctorSelect.appendChild(doctorOption);
    });
});

document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const doctorSelect = document.getElementById('doctorSelect');
    const patientName = document.getElementById('patientName');
    const gender = document.getElementById('genderSelect');
    const age = document.getElementById('age');
    const appointmentTime = document.getElementById('appointmentTime');
    const emailAddress = document.getElementById('emailAddress');

    let isValid = true;

    if (!doctorSelect.value) {
        doctorSelect.classList.add('is-invalid');
        isValid = false;
    } else {
        doctorSelect.classList.remove('is-invalid');
        doctorSelect.classList.add('is-valid');
    }

    if (!patientName.value) {
        patientName.classList.add('is-invalid');
        isValid = false;
    } else {
        patientName.classList.remove('is-invalid');
        patientName.classList.add('is-valid');
    }

    if (!appointmentTime.value) {
        appointmentTime.classList.add('is-invalid');
        isValid = false;
    } else {
        appointmentTime.classList.remove('is-invalid');
        appointmentTime.classList.add('is-valid');
    }

    if (!emailAddress.value) {
        emailAddress.classList.add('is-invalid');
        isValid = false;
    } else {
        emailAddress.classList.remove('is-invalid');
        emailAddress.classList.add('is-valid');
    }

    if (!isValid) {
        return;
    }

    const emailBody = `
        <h3>Appointment Booking Confirmation</h3>
        <p><strong>Doctor Name:</strong> ${doctorSelect.value}</p>
        <p><strong>Patient Name:</strong> ${patientName.value}</p>
        <p><strong>Gender:</strong> ${gender.value}</p>
        <p><strong>Age:</strong> ${age.value}</p>
        <p><strong>Appointment Time:</strong> ${appointmentTime.value}</p>
    `;

    Email.send({
        Host: "smtp.elasticemail.com",
        Username: "aakriti.panthi.np@gmail.com",
        Password: "CE47F4707941A43564559849C03E49282D40",
        To: emailAddress.value,
        From: "aakriti.panthi.np@gmail.com", // Replace with your email address
        Subject: "Appointment Booking Confirmation",
        Body: emailBody
    }).then(function(response) {
        console.log('Email sent successfully:', response);
        listAppointments(); // Refresh the appointment list
        // Show toast notification
        const toast = document.getElementById('toast');
        toast.textContent = 'Appointment successfully booked!';
        toast.className = 'toast show';
        setTimeout(function() {
            toast.className = toast.className.replace('show', '');
        }, 3000);

        // Clear the form
        document.getElementById('appointmentForm').reset();
        doctorSelect.classList.remove('is-valid');
        patientName.classList.remove('is-valid');
        appointmentTime.classList.remove('is-valid');
        emailAddress.classList.remove('is-valid');
    }).catch(function(error) {
        console.error('Error sending email:', error);
        
        // Show error toast
        const toast = document.getElementById('toast');
        toast.textContent = 'Failed to book appointment.';
        toast.className = 'toast show';
        setTimeout(function() {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    });
});

// Set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Delete a cookie
function eraseCookie(name) {   
    document.cookie = name + '=; Max-Age=-99999999;';  
}

document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const doctorSelect = document.getElementById('doctorSelect');
    const patientName = document.getElementById('patientName').value.trim();
    const appointmentTime = document.getElementById('appointmentTime').value;
    const emailAddress = document.getElementById('emailAddress').value.trim();
    const genderSelect = document.getElementById('genderSelect');
    const age = document.getElementById('age');


    if (doctorSelect.value && patientName && appointmentTime && emailAddress) {
        const appointment = {
            doctor: doctorSelect.value,
            name: patientName,
            time: appointmentTime,
            email: emailAddress,
            gender: genderSelect.value,
            age: age.value
        };

        // Add appointment to cookie
        let appointments = JSON.parse(getCookie('appointments') || '[]');
        appointments.push(appointment);
        setCookie('appointments', JSON.stringify(appointments), 7); // Expires in 7 days

        document.getElementById('appointmentForm').reset();
    } else {
    }
});

function listAppointments() {
    const appointmentsList = document.getElementById('appointments-list');
    const appointments = JSON.parse(getCookie('appointments')) || []; // Get appointments from cookie

    // Clear existing rows
    appointmentsList.innerHTML = '';

    // Populate table with appointments
    appointments.forEach((appointment, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.doctor}</td>
            <td>${appointment.name}</td>
            <td>${appointment.gender}</td>
            <td>${appointment.age}</td>
            <td>${appointment.time}</td>
            <td>
                <select class="status-dropdown" data-index="${index}" class="form-control">
                    <option value="Active" ${appointment.status === 'Active' ? 'selected' : ''}>Active</option>
                    <option value="Check-In" ${appointment.status === 'Check-In' ? 'selected' : ''}>Check-In</option>
                    <option value="Check-Out" ${appointment.status === 'Check-Out' ? 'selected' : ''}>Check-Out</option>
                    <option value="Cancelled" ${appointment.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
        `;
        appointmentsList.appendChild(row);
    });

    // Add event listeners for dropdowns
    document.querySelectorAll('.status-dropdown').forEach(dropdown => {
        dropdown.addEventListener('change', (event) => {
            const index = event.target.getAttribute('data-index');
            const newStatus = event.target.value;
            updateAppointmentStatus(index, newStatus);
        });
    });
}

function createAppointmentsSection() {
    const makeAppointmentSection = document.querySelector('#appointments'); // Select the "Make an Appointment" section by its ID or class
    const section = document.createElement('section');
    section.className = 'section';
    section.id = 'appointments';
    section.innerHTML = `
        <div class="container text-center">
            <p class="section-subtitle">View Your Appointments</p>
            <h6 class="section-title mb-5">Appointments</h6>
            <table id="appointments-table" class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Doctor</th>
                        <th>Patient</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody id="appointments-list">
                    <!-- Appointments will be listed here -->
                </tbody>
            </table>
        </div>
    `;
    // Insert the new section after the "Make an Appointment" section
    makeAppointmentSection.insertAdjacentElement('afterend', section);
}

function updateAppointmentStatus(index, newStatus) {
    const appointments = JSON.parse(getCookie('appointments')) || []; // Get appointments from cookie
    if (appointments[index]) {
        appointments[index].status = newStatus;
        setCookie('appointments', JSON.stringify(appointments), 7); // Update the cookie with the new status
        listAppointments(); // Refresh the appointment list
        showToast("Success", "Appointment status changed sucessfully.", "success");
    }
}

document.getElementById('send-button').addEventListener('click', submitQuery);
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        submitQuery();
    }
});

function submitQuery() {
    var query = document.getElementById("user-input").value.trim();
    if (query !== "") {
        var chatHistory = document.getElementById("chat-history");
        chatHistory.innerHTML += "<div class='message user'>User: " + query + "</div>";
        document.getElementById("user-input").value = "";

        var loadingIndicator = document.getElementById("loading-indicator");
        loadingIndicator.style.display = "block";

        fetch("/process_query", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "query=" + encodeURIComponent(query)
        })
        .then(response => response.json())
        .then(data => {
            loadingIndicator.style.display = "none";
            var botResponse = "";
            
            if (Array.isArray(data.response)) {
                // Assuming data.response is an array of arrays like [("John", "Doe"), ...]
                botResponse = "<div class='message bot'>Bot: The list of patients in the database is:</div>";
                botResponse += "<table class='table'><thead><tr><th>First Name</th><th>Last Name</th></tr></thead><tbody>";
                
                data.response.forEach(item => {
                    botResponse += `<tr><td>${item[0]}</td><td>${item[1]}</td></tr>`;
                });

                botResponse += "</tbody></table>";
            } else {
                botResponse = "<div class='message bot'>Bot: " + data.response + "</div>";
            }

            chatHistory.innerHTML += botResponse;
            chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
        })
        .catch(error => {
            loadingIndicator.style.display = "none";
            console.error("Error:", error);
        });
    }
}
// JavaScript to change navbar color on scroll
window.addEventListener('scroll', function() {
    var navbar = document.querySelector('.custom-navbar');
    if (window.scrollY > 50) { // Change 50 to the scroll position you prefer
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

