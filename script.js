/* ==========================================================
   COLIN BAMFORTH PORTFOLIO INTERACTION ENGINE
========================================================== */

const regionMap = {
    'US': 'com', 'GB': 'co.uk', 'UK': 'co.uk', 'CA': 'ca', 
    'AU': 'com.au', 'DE': 'de', 'FR': 'fr', 'JP': 'co.jp', 
    'IN': 'in', 'BR': 'com.br', 'MX': 'com.mx'
};

async function runGeolocationEngine() {
    let activeExtension = 'com';

    try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
            const data = await response.json();
            const detectedCountry = data.country_code;
            
            if (regionMap[detectedCountry]) {
                activeExtension = regionMap[detectedCountry];
            }
        }
    } catch (error) {
        console.log("Location engine safely defaulted to Amazon.com.");
    }

    const mainLinks = document.querySelectorAll('.amazon-link');
    mainLinks.forEach(link => {
        const asin = link.getAttribute('data-asin');
        if (asin) {
            link.href = `https://www.amazon.${activeExtension}/dp/${asin}`;
        }
    });
}

// Bind event listeners dynamically once the DOM is secure and painted
document.addEventListener('DOMContentLoaded', () => {
    // Run the local marketplace routing engine
    runGeolocationEngine();

    // Securely handle form submission without inline HTML attributes
    const newsletterForm = document.querySelector('.newsletter-box form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Thank you for subscribing!');
            newsletterForm.reset();
        });
    }

    // Securely handle notice popups for unreleased books
    const pendingButtons = document.querySelectorAll('.pending-btn');
    pendingButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            alert('Release pending September 2026!');
        });
    });
});
