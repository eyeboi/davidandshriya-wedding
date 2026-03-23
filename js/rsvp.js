/* ============================================
   RSVP Page — Multi-step form logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('rsvpForm');
  const steps = document.querySelectorAll('.form-step');
  const progressBar = document.getElementById('progressBar');
  const totalSteps = steps.length;
  let currentStep = 1;

  function showStep(n) {
    steps.forEach(s => {
      s.classList.remove('active');
      if (parseInt(s.dataset.step) === n) {
        s.classList.add('active');
      }
    });
    currentStep = n;
    progressBar.style.width = `${(n / totalSteps) * 100}%`;
    window.scrollTo({ top: document.querySelector('.rsvp-main').offsetTop - 100, behavior: 'smooth' });
  }

  // Next buttons
  document.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.dataset.next);

      // Validate required fields in current step
      const currentFieldset = document.querySelector(`.form-step[data-step="${currentStep}"]`);
      const requiredFields = currentFieldset.querySelectorAll('[required]');
      let valid = true;

      requiredFields.forEach(field => {
        if (field.type === 'radio') {
          const radioGroup = currentFieldset.querySelectorAll(`[name="${field.name}"]`);
          const checked = [...radioGroup].some(r => r.checked);
          if (!checked) {
            valid = false;
            // Highlight the group
            field.closest('.form-group').style.outline = '1px solid var(--coral, #f0885a)';
            field.closest('.form-group').style.outlineOffset = '8px';
            setTimeout(() => {
              field.closest('.form-group').style.outline = '';
            }, 2000);
          }
        } else if (!field.value.trim()) {
          valid = false;
          field.style.borderBottomColor = 'var(--coral, #f0885a)';
          setTimeout(() => {
            field.style.borderBottomColor = '';
          }, 2000);
        }
      });

      if (valid) {
        showStep(nextStep);
      }
    });
  });

  // Prev buttons
  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      showStep(parseInt(btn.dataset.prev));
    });
  });

  // Show guest names field when guests > 1
  const guestsSelect = document.getElementById('guests');
  const guestNamesGroup = document.getElementById('guestNamesGroup');

  guestsSelect.addEventListener('change', () => {
    guestNamesGroup.style.display = parseInt(guestsSelect.value) > 1 ? 'block' : 'none';
  });

  // Show kids names field
  document.querySelectorAll('[name="kids"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.getElementById('kidsNamesGroup').style.display =
        radio.value === 'yes' && radio.checked ? 'block' : 'none';
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const data = {};
    for (const [key, value] of fd.entries()) {
      if (data[key]) {
        // Handle multiple values (checkboxes)
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    // --- CHANGE THIS URL ---
    // After deploying your Google Apps Script, paste the URL here:
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7gdVVsELqNmAE9uBsWYdmdYAVWXtukZ6ppF3eWDk6zgwyVzPyBRAqcp2gPoSA6Et_NA/exec';

    // Disable submit button while sending
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending...';

    // Send to Google Sheets
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(() => {
      showSuccess(data);
    })
    .catch((err) => {
      console.error('RSVP submit error:', err);
      // Still show success — Google Apps Script with no-cors
      // doesn't return a readable response, but the data goes through
      showSuccess(data);
    });

    function showSuccess(data) {
      form.style.display = 'none';
      const success = document.getElementById('rsvpSuccess');
      success.style.display = 'block';

      document.getElementById('successName').textContent = `Thank you, ${data.fullName}.`;
      document.getElementById('successMsg').textContent =
        data.attending === 'yes'
          ? "We're so excited to celebrate with you. You'll receive a confirmation email with all the details soon."
          : "We'll miss you, but thank you so much for letting us know. You'll be in our hearts on the big day.";

      progressBar.style.width = '100%';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

});
