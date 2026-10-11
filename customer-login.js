/**
 * ABZ. Customer Portal Authentication Handler
 * Manages member validation, password visibility toggles,
 * and dialog demonstrations for password resets / registration.
 */

(function () {
  'use strict';

  // Apply theme from localStorage
  const savedTheme = localStorage.getItem('abz_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const updated = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', updated);
      localStorage.setItem('abz_theme', updated);
    });
  }

  // Pre-fill plan query if passed from membership selection
  const urlParams = new URLSearchParams(window.location.search);
  const planParam = urlParams.get('plan');
  if (planParam) {
    const heading = document.querySelector('.auth-subheading');
    if (heading) {
      heading.textContent = `Sign in to activate your selected "${planParam.toUpperCase()}" membership protocol.`;
    }
  }

  // Dynamic Year
  const yearEls = document.querySelectorAll('.current-year');
  yearEls.forEach(el => el.textContent = new Date().getFullYear());

  // Password Visibility Toggle
  const custPwd = document.getElementById('cust-password');
  const custToggleBtn = document.getElementById('toggle-cust-pwd');

  if (custToggleBtn && custPwd) {
    const eyeShow = custToggleBtn.querySelector('.eye-show');
    const eyeHide = custToggleBtn.querySelector('.eye-hide');

    custToggleBtn.addEventListener('click', () => {
      const isPassword = custPwd.type === 'password';
      custPwd.type = isPassword ? 'text' : 'password';
      custToggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      if (eyeShow && eyeHide) {
        eyeShow.style.display = isPassword ? 'none' : 'block';
        eyeHide.style.display = isPassword ? 'block' : 'none';
      }
    });
  }

  // Customer Form Validation
  const form = document.getElementById('customer-login-form');
  const emailInput = document.getElementById('cust-email');
  const emailError = document.getElementById('cust-email-error');
  const pwdError = document.getElementById('cust-password-error');
  const feedback = document.getElementById('customer-feedback');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      emailError.textContent = '';
      pwdError.textContent = '';
      emailInput.classList.remove('is-invalid');
      custPwd.classList.remove('is-invalid');
      feedback.className = 'auth-feedback';
      feedback.textContent = '';

      const emailVal = emailInput.value.trim();
      const pwdVal = custPwd.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+\$/;

      if (!emailVal) {
        emailError.textContent = 'Email address is required.';
        emailInput.classList.add('is-invalid');
        valid = false;
      } else if (!emailRegex.test(emailVal)) {
        emailError.textContent = 'Please enter a valid email address.';
        emailInput.classList.add('is-invalid');
        valid = false;
      }

      if (!pwdVal) {
        pwdError.textContent = 'Password is required.';
        custPwd.classList.add('is-invalid');
        valid = false;
      } else if (pwdVal.length < 6) {
        pwdError.textContent = 'Password must be at least 6 characters.';
        custPwd.classList.add('is-invalid');
        valid = false;
      }

      if (valid) {
        feedback.className = 'auth-feedback success';
        feedback.textContent = 'Input format verified. In production, submit to your customer auth endpoint (e.g. Supabase, Firebase, or Custom OAuth).';
      } else {
        feedback.className = 'auth-feedback error';
        feedback.textContent = 'Please correct the indicated errors above.';
      }
    });
  }

  // Modal Dialog Logic (Forgot Password & Registration Demonstration)
  const modal = document.getElementById('auth-modal');
  const openForgotBtn = document.getElementById('open-forgot-dialog');
  const openRegisterBtn = document.getElementById('open-register-dialog');
  const closeModalBtn = document.getElementById('close-modal');
  const cancelModalBtn = document.getElementById('modal-cancel');
  const confirmModalBtn = document.getElementById('modal-confirm');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');
  const modalInput = document.getElementById('modal-input');
  const modalFeedback = document.getElementById('modal-feedback');

  function openDialog(type) {
    if (!modal) return;
    modalFeedback.textContent = '';
    modalInput.value = '';

    if (type === 'forgot') {
      modalTitle.textContent = 'RESET PASSWORD';
      modalDesc.textContent = 'Provide your account email to generate a password recovery dispatch.';
      confirmModalBtn.textContent = 'Send Recovery Link';
    } else {
      modalTitle.textContent = 'NEW ATHLETE ENROLLMENT';
      modalDesc.textContent = 'Enter your email to initiate account onboarding for your chosen protocol.';
      confirmModalBtn.textContent = 'Start Registration';
    }

    modal.showModal();
  }

  if (openForgotBtn) openForgotBtn.addEventListener('click', () => openDialog('forgot'));
  if (openRegisterBtn) openRegisterBtn.addEventListener('click', () => openDialog('register'));

  function closeDialog() {
    if (modal) modal.close();
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeDialog);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeDialog);

  if (confirmModalBtn) {
    confirmModalBtn.addEventListener('click', () => {
      const email = modalInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+\$/;

      if (!email || !emailRegex.test(email)) {
        modalFeedback.style.color = '#ff8585';
        modalFeedback.textContent = 'Please enter a valid email address.';
        return;
      }

      modalFeedback.style.color = 'var(--accent)';
      modalFeedback.textContent = 'Demo action verified! Connect your mailing service to dispatch live notifications.';
      setTimeout(closeDialog, 2000);
    });
  }
})();