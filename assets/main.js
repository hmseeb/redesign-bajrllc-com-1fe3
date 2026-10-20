/* Before & After Junk Removal, LLC — site scripts */
(function () {
  'use strict';

  /* ---------------- Mobile navigation ---------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------------- Footer year ---------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------- Scroll reveal ---------------- */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      Array.prototype.forEach.call(revealables, function (el, i) {
        el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
        io.observe(el);
      });
    } else {
      Array.prototype.forEach.call(revealables, function (el) {
        el.classList.add('is-in');
      });
    }
  }

  /* ---------------- Forms ---------------- */
  var ENDPOINT = 'https://vision.leadrai.com/api/forms/1763a4451ea53421e123ccd6ea07a3e0';

  // Stamp the current page URL into every hidden _page field.
  Array.prototype.forEach.call(document.querySelectorAll('input[name="_page"]'), function (el) {
    el.value = window.location.href;
  });

  function showStatus(form, type, message) {
    var box = form.querySelector('.form-status');
    if (!box) return;
    box.classList.remove('form-status--ok', 'form-status--err');
    box.classList.add(type === 'ok' ? 'form-status--ok' : 'form-status--err');
    box.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (type === 'ok'
        ? '<circle cx="12" cy="12" r="10"></circle><path d="M8 12.5l2.5 2.5L16 9.5"></path>'
        : '<circle cx="12" cy="12" r="10"></circle><path d="M12 7v6"></path><path d="M12 16.5h.01"></path>') +
      '</svg><span>' + message + '</span>';
    box.classList.add('is-visible');
    box.setAttribute('role', 'status');
  }

  // Show confirmation after a plain (non-JS) submission returns with ?submitted=1
  if (/[?&]submitted=1(&|$)/.test(window.location.search)) {
    var firstForm = document.querySelector('form[data-leadr]');
    if (firstForm) {
      showStatus(firstForm, 'ok', 'Thanks, your message was sent. We’ll get back to you shortly — or call us now at 936-755-0700.');
      try {
        firstForm.reset();
        Array.prototype.forEach.call(document.querySelectorAll('input[name="_page"]'), function (el) {
          el.value = window.location.href;
        });
      } catch (err) { /* no-op */ }
      firstForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll('form[data-leadr]'), function (form) {
    form.addEventListener('submit', function (e) {
      if (!window.fetch || !form.checkValidity()) return; // let the browser handle it
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Sending…';
      }

      var pageField = form.querySelector('input[name="_page"]');
      if (pageField) pageField.value = window.location.href;

      var payload = {};
      new FormData(form).forEach(function (value, key) {
        payload[key] = value;
      });
      payload._page = window.location.href;

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () { return { ok: res.ok }; });
        })
        .then(function (data) {
          if (data && data.ok) {
            form.reset();
            if (pageField) pageField.value = window.location.href;
            showStatus(form, 'ok', 'Thanks, your message was sent. We’ll get back to you shortly — or call us now at 936-755-0700.');
          } else {
            throw new Error('Submission rejected');
          }
        })
        .catch(function () {
          showStatus(form, 'err', 'Sorry, something went wrong sending your request. Please call or text us at 936-755-0700.');
        })
        .then(function () {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = label;
          }
        });
    });
  });
})();
