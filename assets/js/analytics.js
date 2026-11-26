/**
 * Google Analytics 4 (GA4) Configuration & Custom Event Tracking
 */
(function () {
  var GA_MEASUREMENT_ID = 'G-8RL9F3RF9E';

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }

  var isConfigured =
    GA_MEASUREMENT_ID &&
    GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX' &&
    GA_MEASUREMENT_ID.indexOf('G-') === 0;

  if (isConfigured) {
    var existingScript = document.querySelector(
      'script[src*="googletagmanager.com/gtag/js"]'
    );
    if (!existingScript) {
      var script = document.createElement('script');
      script.async = true;
      script.src =
        'https://www.googletagmanager.com/gtag/js?id=' +
        encodeURIComponent(GA_MEASUREMENT_ID);
      document.head.appendChild(script);

      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID);
    }
  }

  /**
   * Helper to record custom GA4 events safely.
   *
   * @param {string} eventName
   * @param {Object} params
   */
  window.trackAnalyticsEvent = function (eventName, params) {
    var payload = Object.assign(
      {
        page_path: window.location.pathname,
        page_location: window.location.href,
        transport_type: 'beacon',
      },
      params || {}
    );

    if (isConfigured && typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    } else {
      window.dataLayer.push(
        Object.assign({ event: eventName }, payload)
      );
    }
  };

  /**
   * Normalize link hrefs so relative paths resolve consistently across pages.
   *
   * @param {string} rawHref
   * @returns {string}
   */
  function normalizeLinkUrl(rawHref) {
    var trimmed = (rawHref || '').trim();
    if (
      !trimmed ||
      trimmed.charAt(0) === '#' ||
      /^(mailto:|tel:)/i.test(trimmed)
    ) {
      return trimmed;
    }

    if (typeof URL !== 'function') {
      return trimmed;
    }

    try {
      var resolved = new URL(trimmed, window.location.href);
      if (
        resolved.origin === window.location.origin &&
        resolved.pathname.slice(-1) !== '/'
      ) {
        var lastSegment = resolved.pathname.split('/').pop() || '';
        if (lastSegment.indexOf('.') === -1) {
          resolved.pathname += '/';
        }
      }
      return resolved.href;
    } catch (err) {
      return trimmed;
    }
  }

  /**
   * Read analytics attributes from an anchor element and send a GA4 event.
   *
   * @param {HTMLAnchorElement} el
   */
  function trackLinkClick(el) {
    var eventName =
      el.getAttribute('data-analytics-event') || 'link_click';
    var label =
      el.getAttribute('data-analytics-label') ||
      el.getAttribute('title') ||
      el.textContent.trim();
    var category =
      el.getAttribute('data-analytics-category') || 'engagement';
    var status = el.getAttribute('data-analytics-status') || 'live';
    var href = normalizeLinkUrl(el.getAttribute('href') || '');

    window.trackAnalyticsEvent(eventName, {
      event_category: category,
      event_label: label,
      link_url: href,
      link_status: status,
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var allLinks = document.querySelectorAll('a[href]');
    allLinks.forEach(function (el) {
      el.addEventListener('click', function () {
        trackLinkClick(el);
      });
      el.addEventListener('auxclick', function (event) {
        if (event && event.button === 1) {
          trackLinkClick(el);
        }
      });
    });
  });
})();
