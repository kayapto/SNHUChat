// Smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
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
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const nav = document.querySelector('.custom-navbar .nav');

    if (navToggle && nav) {
        navToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            navToggle.classList.toggle('is-active');
        });
    }
});

// Form submission handling
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', e => {
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
document.addEventListener('DOMContentLoaded', () => {
    const queryInput = document.getElementById('query-input');
    
    if (queryInput) {
        queryInput.addEventListener('keypress', event => {
            if (event.key === 'Enter') {
                submitQuery();
            }
        });
    }
});
function submitQuery() {
    console.log("submitQuery function triggered"); // Debugging line
    var query = document.getElementById("query-input").value.trim();
    if (query !== "") {
        var chatHistory = document.getElementById("chat-history");
        chatHistory.innerHTML += "<div class='message user'>User: " + query + "</div>";
        document.getElementById("query-input").value = "";
        
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
                botResponse = "<div class='message bot'>Bot: The list of patients in the database is:</div><ul>";
                data.response.forEach(patient => {
                    botResponse += "<li>" + patient + "</li>";
                });
                botResponse += "</ul>";
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

function handleKeyPress(event) {
    if (event.key === "Enter") {
        submitQuery();
    }
}
