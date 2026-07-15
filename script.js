document.addEventListener('DOMContentLoaded', () => {
    // Finds your mailing list form automatically
    const newsletterForm = document.querySelector('.newsletter-box form') || document.querySelector('form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (!emailInput) return;
            
            const email = emailInput.value;

            try {
                // Direct, secure connection to your specific Cloudflare Worker
                const response = await fetch('https://boundtext-signup-engine.colin-533.workers.dev', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                });

                if (response.ok) {
                    alert('Thanks for subscribing! Colin will be in touch with updates.');
                    newsletterForm.reset();
                } else {
                    alert('Something went wrong on the server. Please try again.');
                }
            } catch (error) {
                alert('Connection error. If you use an ad-blocker or privacy shield, please temporarily disable it for this site to test the subscription form.');
            }
        });
    }
});
