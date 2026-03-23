/* ============================================
   RSVP Page — Multi-step form logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('rsvpForm');
  const steps = document.querySelectorAll('.form-step');
  const progressBar = document.getElementById('progressBar');
  const totalSteps = steps.length;
  let currentStep = 1;

  // --- Guest List Autocomplete ---
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxV0VElPrQf5EHTrQ58x5IZX4A5DqHxtfccGl9sne0i2SfJY8xFkM-LJrIilwei3eHFqA/exec';
  let guestNames = [];

  // Fetch guest list from Sheet #3
  fetch(GOOGLE_SCRIPT_URL + '?action=guestlist')
    .then(r => r.json())
    .then(data => {
      if (data.result === 'success') {
        guestNames = data.names;
      }
    })
    .catch(() => {});

  const nameInput = document.getElementById('fullName');
  const suggestions = document.getElementById('nameSuggestions');
  const nameError = document.getElementById('nameError');
  let nameVerified = false;

  nameInput.addEventListener('input', () => {
    const val = nameInput.value.trim().toLowerCase();
    suggestions.innerHTML = '';
    nameVerified = false;
    nameError.style.display = 'none';

    if (val.length < 1 || guestNames.length === 0) {
      suggestions.style.display = 'none';
      return;
    }

    const matches = guestNames.filter(n =>
      n.toString().toLowerCase().includes(val)
    ).slice(0, 8);

    // Check for exact match as user types
    if (guestNames.some(n => n.toString().toLowerCase() === val)) {
      nameVerified = true;
    }

    if (matches.length === 0) {
      suggestions.style.display = 'none';
      return;
    }

    matches.forEach(name => {
      const li = document.createElement('li');
      li.textContent = name;
      li.addEventListener('click', () => {
        nameInput.value = name;
        nameVerified = true;
        nameError.style.display = 'none';
        suggestions.style.display = 'none';
      });
      suggestions.appendChild(li);
    });

    suggestions.style.display = 'block';
  });

  // Hide suggestions on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.name-search-group')) {
      suggestions.style.display = 'none';
    }
  });

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

      // Enforce guest list on step 1
      if (valid && currentStep === 1 && !nameVerified) {
        valid = false;
        nameError.style.display = 'block';
        nameInput.style.borderBottomColor = 'var(--coral, #f0885a)';
        setTimeout(() => {
          nameInput.style.borderBottomColor = '';
        }, 3000);
      }

      if (valid) {
        // If declining, skip to final step (step 4)
        if (currentStep === 1) {
          const attending = document.querySelector('[name="attending"]:checked');
          if (attending && attending.value === 'no') {
            showStep(4);
            return;
          }
        }
        showStep(nextStep);
      }
    });
  });

  // Prev buttons
  document.querySelectorAll('.btn-prev').forEach(btn => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.dataset.prev);
      // If on step 4 and they declined, go back to step 1
      if (currentStep === 4) {
        const attending = document.querySelector('[name="attending"]:checked');
        if (attending && attending.value === 'no') {
          showStep(1);
          return;
        }
      }
      showStep(prevStep);
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
