const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

forgotPasswordLink.addEventListener('click', () => {
    const email = prompt("Please enter your email address:");
    if (email === null) {
        // User pressed "Cancel", just exit the function
        return;
    } else if (validateEmail(email)) {
        alert("Your password has been sent to your email address.");
    } else {
        alert("Please enter a valid email address.");
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
