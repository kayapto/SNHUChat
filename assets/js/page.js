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
       if (username === "admin" && password === "admin") {
           modal.style.display = "none"; // Hide the modal
           showToast("Success", "Login successful", "success");
       } else {
           alert("Invalid username or password. Please try again.")
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
