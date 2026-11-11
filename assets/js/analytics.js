/**
 * Google Analytics 4 (GA4) Configuration & Custom Event Tracking
 *
 * TODO: Replace 'G-XXXXXXXXXX' below with your actual GA4 Measurement ID.
 */
(function () {
  var GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  var isConfigured =
    GA_MEASUREMENT_ID &&
    GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX' &&
    GA_MEASUREMENT_ID.indexOf('G-') === 0;

  if (isConfigured) {
    var script = document.createElement('script');
    script.async = true;
    script.src =
      'https://www.googletagmanager.com/gtag/js?id=' +
      encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: window.location.pathname,
      page_title: document.title,
    });
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

  document.addEventListener('DOMContentLoaded', function () {
    var allLinks = document.querySelectorAll('a[href]');
    allLinks.forEach(function (el) {
      el.addEventListener('click', function () {
        var eventName =
          el.getAttribute('data-analytics-event') || 'link_click';
        var label =
          el.getAttribute('data-analytics-label') ||
          el.getAttribute('title') ||
          el.textContent.trim();
        var category =
          el.getAttribute('data-analytics-category') || 'engagement';
        var status = el.getAttribute('data-analytics-status') || 'live';
        var href = el.getAttribute('href') || '';

        window.trackAnalyticsEvent(eventName, {
          event_category: category,
          event_label: label,
          link_url: href,
          link_status: status,
        });
      });
    });
  });
})();
