/**
 * ABZ. Gym Main Interactive Script
 * Handles Theme Management, Side Drawer Navigation, Scroll Reveals,
 * Form Validation, and Cookie Preferences.
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // Theme Toggle & Persistence
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  function initializeTheme() {
    const savedTheme = localStorage.getItem('abz_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      applyTheme(savedTheme);
    } else {
      // Default to Dark theme per specification
      applyTheme('dark');
    }
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('abz_theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      );
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  initializeTheme();

  // --------------------------------------------------------------------------
  // Slide-in Side Drawer Navigation
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closePanelBtn = document.getElementById('close-panel');
  const sidePanel = document.getElementById('side-panel');
  const panelOverlay = document.getElementById('panel-overlay');
  const panelLinks = document.querySelectorAll('.panel-link');

  function openPanel() {
    if (!sidePanel || !panelOverlay) return;
    sidePanel.classList.add('is-open');
    panelOverlay.classList.add('is-open');
    sidePanel.setAttribute('aria-hidden', 'false');
    panelOverlay.setAttribute('aria-hidden', 'false');
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus close button for keyboard accessibility
    if (closePanelBtn) closePanelBtn.focus();
  }

  function closePanel() {
    if (!sidePanel || !panelOverlay) return;
    sidePanel.classList.remove('is-open');
    panelOverlay.classList.remove('is-open');
    sidePanel.setAttribute('aria-hidden', 'true');
    panelOverlay.setAttribute('aria-hidden', 'true');
    if (hamburgerBtn) {
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      hamburgerBtn.focus();
    }
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openPanel);
  if (closePanelBtn) closePanelBtn.addEventListener('click', closePanel);
  if (panelOverlay) panelOverlay.addEventListener('click', closePanel);

  panelLinks.forEach(link => {
    link.addEventListener('click', closePanel);
  });

  // Close with Escape Key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidePanel && sidePanel.classList.contains('is-open')) {
      closePanel();
    }
  });

  // --------------------------------------------------------------------------
  // Active Navigation Link Highlighting on Scroll
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-shortcuts .nav-link');

  function highlightNavOnScroll() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // --------------------------------------------------------------------------
  // Scroll Reveal via IntersectionObserver
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // --------------------------------------------------------------------------
  // Contact Form Validation & State
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      // Reset errors
      clearError(nameInput, 'name-error');
      clearError(emailInput, 'email-error');
      clearError(subjectInput, 'subject-error');
      clearError(messageInput, 'message-error');

      // Name Validation
      if (!nameInput.value.trim()) {
        showError(nameInput, 'name-error', 'Please enter your full name.');
        isValid = false;
      }

      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+\$/;
      if (!emailInput.value.trim()) {
        showError(emailInput, 'email-error', 'Email address is required.');
        isValid = false;
      } else if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'email-error', 'Please enter a valid email address.');
        isValid = false;
      }

      // Subject Validation
      if (!subjectInput.value) {
        showError(subjectInput, 'subject-error', 'Please select a topic.');
        isValid = false;
      }

      // Message Validation
      if (!messageInput.value.trim()) {
        showError(messageInput, 'message-error', 'Please write your message.');
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, 'message-error', 'Message should be at least 10 characters.');
        isValid = false;
      }

      if (isValid) {
        // Safe, non-deceptive feedback
        formStatus.className = 'form-status success';
        formStatus.textContent = 'Inquiry verified on frontend. In demo mode, connect your backend API or webhook (e.g., Formspree/Resend) to process emails.';
        contactForm.reset();
      } else {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Please correct the highlighted errors before submitting.';
      }
    });

    function showError(input, errorId, message) {
      input.classList.add('is-invalid');
      const errorEl = document.getElementById(errorId);
      if (errorEl) errorEl.textContent = message;
    }

    function clearError(input, errorId) {
      input.classList.remove('is-invalid');
      const errorEl = document.getElementById(errorId);
      if (errorEl) errorEl.textContent = '';
    }
  }

  // --------------------------------------------------------------------------
  // Cookie Consent Notification
  // --------------------------------------------------------------------------
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAcceptBtn = document.getElementById('cookie-accept');
  const cookieDenyBtn = document.getElementById('cookie-deny');

  function checkCookiePreference() {
    if (!cookieBanner) return;
    const consent = localStorage.getItem('abz_cookie_consent');
    if (!consent) {
      // Delay slightly for polite user experience
      setTimeout(() => {
        cookieBanner.removeAttribute('hidden');
      }, 1200);
    }
  }

  if (cookieAcceptBtn) {
    cookieAcceptBtn.addEventListener('click', () => {
      localStorage.setItem('abz_cookie_consent', 'accepted');
      dismissCookieBanner();
    });
  }

  if (cookieDenyBtn) {
    cookieDenyBtn.addEventListener('click', () => {
      localStorage.setItem('abz_cookie_consent', 'denied');
      dismissCookieBanner();
    });
  }

  function dismissCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.style.opacity = '0';
    cookieBanner.style.transform = 'translateY(20px)';
    setTimeout(() => {
      cookieBanner.setAttribute('hidden', 'true');
    }, 350);
  }

  checkCookiePreference();

  // --------------------------------------------------------------------------
  // Dynamic Current Year Injection
  // --------------------------------------------------------------------------
  const yearSpans = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach(span => {
    span.textContent = currentYear;
  });

})();