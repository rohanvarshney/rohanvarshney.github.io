/**
 * Shared behaviour for the booking / collaboration landing pages (/dj, /production).
 *
 * Everything is opt-in through data attributes so the HTML stays declarative:
 *   body[data-contact-email]      single place to set the booking / collab email
 *   [data-email-link]             <a> that becomes a mailto: link + shows the email
 *   [data-coming-soon="Label"]    placeholder link/button -> "coming soon" toast
 *   [data-share]                  native share sheet, falls back to copying the URL
 *   [data-copy-email]             copies the contact email
 *   [data-copy-target="#id"]      copies the text of another element
 *   form[data-mailto-form]        inquiry form -> pre-filled email (no backend needed)
 *   [data-waveform]               decorative waveform bars (data-seed, data-progress)
 *   [data-filter-group]           chip filters for [data-category] items
 *   [data-bio-tab] / [data-bio-panel]  short / long bio switcher
 *   [data-year]                   current year
 */
(function () {
  'use strict';

  var toastTimeout;

  function track(eventName, params) {
    if (typeof window.trackAnalyticsEvent === 'function') {
      window.trackAnalyticsEvent(eventName, params || {});
    }
  }

  function getContactEmail() {
    return document.body.getAttribute('data-contact-email') || '';
  }

  /* ---------- Toast ---------- */

  function showToast(message) {
    var toast = document.getElementById('coming-soon-banner');
    var text = document.getElementById('coming-soon-text');
    if (!toast || !text) {
      return;
    }
    text.textContent = message;
    toast.classList.add('visible');
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    toastTimeout = setTimeout(hideToast, 3800);
  }

  function hideToast() {
    var toast = document.getElementById('coming-soon-banner');
    if (toast) {
      toast.classList.remove('visible');
    }
  }

  window.showToast = showToast;
  window.hideComingSoon = hideToast;
  window.showComingSoon = function (event, label) {
    if (event) {
      event.preventDefault();
    }
    showToast(label + ' \u2014 coming soon!');
  };

  /* ---------- Clipboard ---------- */

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = value;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy');
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  function flashCopied(button, message) {
    if (!button) {
      return;
    }
    var original = button.getAttribute('data-original-label') || button.innerHTML;
    button.setAttribute('data-original-label', original);
    button.classList.add('copied');
    button.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i> Copied';
    setTimeout(function () {
      button.classList.remove('copied');
      button.innerHTML = original;
    }, 1600);
    if (message) {
      showToast(message);
    }
  }

  /* ---------- Init helpers ---------- */

  function initEmailLinks() {
    var email = getContactEmail();
    if (!email) {
      return;
    }
    document.querySelectorAll('[data-email-link]').forEach(function (el) {
      var subject = el.getAttribute('data-email-subject') || '';
      el.setAttribute(
        'href',
        'mailto:' + email + (subject ? '?subject=' + encodeURIComponent(subject) : '')
      );
      if (el.hasAttribute('data-email-show')) {
        el.textContent = email;
      }
    });
  }

  function initComingSoon() {
    document.querySelectorAll('[data-coming-soon]').forEach(function (el) {
      el.addEventListener('click', function (event) {
        event.preventDefault();
        showToast(el.getAttribute('data-coming-soon') + ' \u2014 coming soon!');
      });
    });
  }

  function initShare() {
    document.querySelectorAll('[data-share]').forEach(function (el) {
      el.addEventListener('click', function (event) {
        event.preventDefault();
        var shareData = {
          title: document.title,
          text: (document.querySelector('meta[name="description"]') || {}).content || document.title,
          url: window.location.href.split('#')[0],
        };
        track('portfolio_share', { event_category: 'share', event_label: document.title });
        if (navigator.share) {
          navigator.share(shareData).catch(function () {});
          return;
        }
        copyText(shareData.url).then(
          function () {
            showToast('Link copied \u2014 paste it anywhere.');
          },
          function () {
            showToast(shareData.url);
          }
        );
      });
    });
  }

  function initCopy() {
    document.querySelectorAll('[data-copy-email]').forEach(function (button) {
      button.addEventListener('click', function () {
        copyText(getContactEmail()).then(function () {
          flashCopied(button, 'Email copied to clipboard.');
          track('contact_copy', { event_category: 'contact', event_label: 'email' });
        });
      });
    });

    document.querySelectorAll('[data-copy-target]').forEach(function (button) {
      button.addEventListener('click', function () {
        var selector = button.getAttribute('data-copy-target');
        var target = selector === 'active-bio'
          ? document.querySelector('[data-bio-panel]:not([hidden])')
          : document.querySelector(selector);
        if (!target) {
          return;
        }
        var text = target.innerText.replace(/\n{3,}/g, '\n\n').trim();
        copyText(text).then(function () {
          flashCopied(button, 'Copied \u2014 ready to paste into your flyer or listing.');
          track('press_copy', { event_category: 'press', event_label: selector });
        });
      });
    });
  }

  function initBioTabs() {
    var tabs = document.querySelectorAll('[data-bio-tab]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-bio-tab');
        tabs.forEach(function (t) {
          t.setAttribute('aria-pressed', String(t === tab));
        });
        document.querySelectorAll('[data-bio-panel]').forEach(function (panel) {
          panel.hidden = panel.getAttribute('data-bio-panel') !== key;
        });
      });
    });
  }

  function initForms() {
    document.querySelectorAll('form[data-mailto-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
          return;
        }

        var values = {};
        var lines = [];
        Array.prototype.forEach.call(form.elements, function (field) {
          if (!field.name || field.type === 'submit' || field.type === 'button') {
            return;
          }
          var value = (field.value || '').trim();
          values[field.name] = value;
          if (!value || field.name === 'message') {
            return;
          }
          var label = form.querySelector('label[for="' + field.id + '"]');
          var labelText = label ? label.childNodes[0].textContent.trim() : field.name;
          lines.push(labelText + ': ' + value);
        });

        var subjectTemplate = form.getAttribute('data-subject') || 'Inquiry from {name}';
        var subject = subjectTemplate.replace(/\{(\w+)\}/g, function (_, key) {
          return values[key] || '';
        }).replace(/\s+/g, ' ').replace(/\s[\u2014-]\s*$/, '').trim();

        var body =
          (values.message ? values.message + '\n\n' : '') +
          '\u2014\u2014\u2014\n' +
          lines.join('\n') +
          '\n\nSent from ' + window.location.href.split('#')[0];

        var email = getContactEmail();
        track(form.getAttribute('data-analytics-event') || 'inquiry_submit', {
          event_category: form.getAttribute('data-analytics-category') || 'contact',
          event_label: values.event_type || values.project_type || 'inquiry',
        });

        window.location.href =
          'mailto:' + email +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);

        showToast('Opening your email app with everything pre-filled\u2026');
      });
    });
  }

  function seededRandom(seed) {
    var value = seed % 2147483647;
    if (value <= 0) {
      value += 2147483646;
    }
    return function () {
      value = (value * 16807) % 2147483647;
      return (value - 1) / 2147483646;
    };
  }

  function initWaveforms() {
    document.querySelectorAll('[data-waveform]').forEach(function (wave) {
      var bars = parseInt(wave.getAttribute('data-bars') || '72', 10);
      var progress = parseFloat(wave.getAttribute('data-progress') || '0');
      var rand = seededRandom(parseInt(wave.getAttribute('data-seed') || '7', 10));
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < bars; i++) {
        var envelope = 0.45 + 0.55 * Math.sin((i / bars) * Math.PI);
        var height = Math.max(0.12, envelope * (0.35 + rand() * 0.65));
        var bar = document.createElement('span');
        bar.style.height = Math.round(height * 100) + '%';
        if (i / bars < progress) {
          bar.className = 'played';
        }
        fragment.appendChild(bar);
      }
      wave.appendChild(fragment);
    });
  }

  function initFilters() {
    document.querySelectorAll('[data-filter-group]').forEach(function (group) {
      var targetSelector = group.getAttribute('data-filter-group');
      var buttons = group.querySelectorAll('[data-filter]');
      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          var filter = button.getAttribute('data-filter');
          buttons.forEach(function (b) {
            b.setAttribute('aria-pressed', String(b === button));
          });
          document.querySelectorAll(targetSelector + ' [data-category]').forEach(function (item) {
            var categories = item.getAttribute('data-category').split(' ');
            item.hidden = filter !== 'all' && categories.indexOf(filter) === -1;
          });
        });
      });
    });
  }

  function initNav() {
    var nav = document.querySelector('.topnav');
    if (!nav) {
      return;
    }
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (!('IntersectionObserver' in window)) {
      return;
    }
    var links = nav.querySelectorAll('.topnav-links a[href^="#"]');
    var map = {};
    links.forEach(function (link) {
      var section = document.querySelector(link.getAttribute('href'));
      if (section) {
        map[section.id] = link;
      }
    });
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && map[entry.target.id]) {
            links.forEach(function (l) {
              l.classList.remove('active');
            });
            map[entry.target.id].classList.add('active');
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    Object.keys(map).forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) {
        el.classList.add('in');
      });
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initEmailLinks();
    initComingSoon();
    initShare();
    initCopy();
    initBioTabs();
    initForms();
    initWaveforms();
    initFilters();
    initNav();
    initReveal();
    initYear();
  });
})();
