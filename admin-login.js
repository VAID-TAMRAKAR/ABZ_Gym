/**
 * ABZ. Admin Authentication Handler
 * Manages validation, password visibility, and security disclaimers.
 * 
 * NOTE: Production administrative systems require a secure backend endpoint
 * with HTTPS, cryptographic hashing, and server-side RBAC session tokens.
 */

(function () {
  'use strict';

  // Apply theme from localStorage if available
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

  // Current year injection
  const yearEls = document.querySelectorAll('.current-year');
  yearEls.forEach(el => el.textContent = new Date().getFullYear());

  // Password visibility toggle
  const pwdInput = document.getElementById('admin-password');
  const toggleBtn = document.getElementById('toggle-admin-pwd');
  
  if (toggleBtn && pwdInput) {
    const eyeShow = toggleBtn.querySelector('.eye-show');
    const eyeHide = toggleBtn.querySelector('.eye-hide');

    toggleBtn.addEventListener('click', () => {
      const isPassword = pwdInput.type === 'password';
      pwdInput.type = isPassword ? 'text' : 'password';
      toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      if (eyeShow && eyeHide) {
        eyeShow.style.display = isPassword ? 'none' : 'block';
        eyeHide.style.display = isPassword ? 'block' : 'none';
      }
    });
  }

  // Admin Form Validation
  const adminForm = document.getElementById('admin-login-form');
  const idInput = document.getElementById('admin-identifier');
  const idError = document.getElementById('identifier-error');
  const pwdError = document.getElementById('password-error');
  const feedback = document.getElementById('admin-feedback');

  if (adminForm) {
    adminForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      idError.textContent = '';
      pwdError.textContent = '';
      idInput.classList.remove('is-invalid');
      pwdInput.classList.remove('is-invalid');
      feedback.className = 'auth-feedback';
      feedback.textContent = '';

      const idVal = idInput.value.trim();
      const pwdVal = pwdInput.value;

      if (!idVal) {
        idError.textContent = 'Admin Email or Operator ID is required.';
        idInput.classList.add('is-invalid');
        valid = false;
      }

      if (!pwdVal) {
        pwdError.textContent = 'Access passcode is required.';
        pwdInput.classList.add('is-invalid');
        valid = false;
      } else if (pwdVal.length < 6) {
        pwdError.textContent = 'Passcode must be at least 6 characters.';
        pwdInput.classList.add('is-invalid');
        valid = false;
      }

      if (valid) {
        // Transparent demonstration handling
        feedback.className = 'auth-feedback success';
        feedback.textContent = 'Frontend credentials format validated. Connect your server auth router (e.g. POST /api/admin/login) to issue an HTTP-only administrative JWT.';
      } else {
        feedback.className = 'auth-feedback error';
        feedback.textContent = 'Please resolve the highlighted field errors.';
      }
    });
  }
})();