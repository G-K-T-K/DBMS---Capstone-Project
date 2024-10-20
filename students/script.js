// script.js
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');

// Pop-up box elements
const popupOverlay = document.getElementById('popupOverlay');
const closePopup = document.getElementById('closePopup');
const popupBtn = document.getElementById('popupBtn');

// Adding event listener to the "Sign In" form
const signInForm = document.querySelector('.sign-in form');

signInForm.addEventListener('submit', async (event) => {
    event.preventDefault();  // Prevent traditional form submission
    
    const email = signInForm.querySelector('input[type="email"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;

    try {
        const response = await fetch('/students/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();

        if (response.ok) {
            if (result.success) {
                showPopup(result.message);
                // Redirect to the homepage after 1.5 seconds
                setTimeout(() => {
                    window.location.href = "home.html";
                }, 1500);
            } else {
                showPopup(result.message);  // Display error message in pop-up
            }
        } else {
            showPopup('An error occurred while trying to sign in. Please try again.');
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        showPopup('An error occurred while trying to sign in. Please try again.');
    }
});

// Register button event listener
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

// Login button event listener
loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Forgot Password functionality
forgotPasswordLink.addEventListener('click', () => {
    const email = prompt("Please enter your email address:");
    if (email === null) {
        return;
    } else if (validateEmail(email)) {
        showPopup("Your password has been sent to your email address.");
    } else {
        showPopup("Please enter a valid email address.");
    }
});

// Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Show pop-up function
function showPopup(message) {
    const popupText = popupOverlay.querySelector("p");
    popupText.textContent = message;
    popupOverlay.classList.add("popup-visible");
}

// Close pop-up event
closePopup.addEventListener('click', () => {
    popupOverlay.classList.remove("popup-visible");
});

popupBtn.addEventListener('click', () => {
    popupOverlay.classList.remove("popup-visible");
});
