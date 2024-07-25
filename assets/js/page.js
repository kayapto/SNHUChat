// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 40, // Adjust offset as needed
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.querySelector('.custom-navbar .nav');

    navToggle.addEventListener('click', function () {
        nav.classList.toggle('open');
        this.classList.toggle('is-active');
    });
});

// Form submission handling
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Add your form submission logic here
            console.log('Username:', username);
            console.log('Password:', password);

            // For demonstration, show an alert
            alert('Form submitted');
        });
    }
});

// Chatbot query handling
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        submitQuery();
    }
}

function submitQuery() {
    const queryInput = document.getElementById('query-input');
    const query = queryInput.value;

    if (query.trim()) {
        fetch('/process_query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                query: query
            })
        })
        .then(response => response.json())
        .then(data => {
            const chatHistory = document.getElementById('chat-history');
            chatHistory.innerHTML += `<div class="message user">${query}</div>`;
            chatHistory.innerHTML += `<div class="message bot">${data.response}</div>`;
            queryInput.value = '';
            chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}
