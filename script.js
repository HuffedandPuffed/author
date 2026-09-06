/* =============================================================
   COLIN BAMFORTH — AUTHOR SITE
   Newsletter signup -> Cloudflare Worker

   Changes from the previous version:
   - No more alert() popups. Status is shown inline under the form
     (announced to screen readers via aria-live).
   - Button disables while the request is in flight, so a double-tap
     can't submit twice.
   - Basic email sanity check before we bother the Worker.
   - Uses the specific #newsletter-form id rather than a loose
     "first form on the page" fallback.
   ============================================================= */

document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('newsletter-form') ||
               document.querySelector('.newsletter-box form');
    if (!form) return;

    var SIGNUP_ENDPOINT = 'https://boundtext-signup-engine.colin-533.workers.dev';

    var emailInput = form.querySelector('input[type="email"]');
    var submitBtn  = form.querySelector('button[type="submit"]');
    var statusEl   = form.querySelector('.form-status');

    function setStatus(message, kind) {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.className = 'form-status is-visible ' +
            (kind === 'ok' ? 'is-ok' : 'is-error');
    }

    function clearStatus() {
        if (!statusEl) return;
        statusEl.textContent = '';
        statusEl.className = 'form-status';
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (!emailInput) return;

        var email = emailInput.value.trim();
        clearStatus();

        // Cheap client-side sanity check — the Worker should validate too.
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            setStatus('That email address doesn’t look quite right — mind checking it?', 'error');
            emailInput.focus();
            return;
        }

        var originalLabel = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing you up…';
        }

        try {
            var response = await fetch(SIGNUP_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });

            if (response.ok) {
                form.reset();
                setStatus('Thanks — you’re on the list. Look out for the next update.', 'ok');
            } else {
                setStatus('Something went wrong at our end. Please try again in a moment, or email contact@boundtext.com.', 'error');
            }
        } catch (error) {
            setStatus('Couldn’t reach the server. An ad-blocker or privacy shield may be blocking it — or just email contact@boundtext.com and I’ll add you manually.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalLabel;
            }
        }
    });
});
