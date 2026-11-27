/**
 * Shared behaviour for the booking / collaboration landing pages (/dj, /production).
 *
 * Everything is opt-in through data attributes so the HTML stays declarative:
 *   body[data-contact-email]      single place to set the booking / collab email
 *   [data-email-link]             <a> that becomes a mailto: link + shows the email
 *   [data-coming-soon="Label"]    placeholder link/button -> "coming soon" toast
 *   [data-share]                  copies the page URL to clipboard and shows a banner
 *   [data-copy-email]             copies the contact email
 *   [data-copy-target="#id"]      copies the text of another element
 *   form[data-mailto-form]        inquiry form -> pre-filled email (no backend needed)
 *   [data-waveform]               waveform bars (data-peaks or data-seed, data-progress)
 *   [data-audio-player]           lazy-loaded HTML5 audio player + interactive waveform & track list
 *   [data-filter-group]           chip filters for [data-category] items (optional data-filter-empty)
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
    if (toastTimeout) {
      clearTimeout(toastTimeout);
      toastTimeout = null;
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

  function fallbackCopyText(value) {
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = value;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.top = '0';
      area.style.left = '0';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      if (typeof area.setSelectionRange === 'function') {
        area.setSelectionRange(0, value.length);
      }
      try {
        var copied = document.execCommand('copy');
        if (copied) {
          resolve();
        } else {
          reject(new Error('Copy command was unsuccessful'));
        }
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  function copyText(value) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function' && window.isSecureContext) {
      return navigator.clipboard.writeText(value).catch(function () {
        return fallbackCopyText(value);
      });
    }
    return fallbackCopyText(value);
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
        var url = window.location.href.split('#')[0];
        track('portfolio_share', { event_category: 'share', event_label: document.title });
        copyText(url).then(
          function () {
            showToast('Page URL copied to clipboard.');
          },
          function () {
            showToast('Copy this link: ' + url);
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

  function parsePeaks(rawPeaks) {
    if (!rawPeaks) {
      return null;
    }
    var values = rawPeaks
      .split(',')
      .map(function (part) {
        return parseFloat(part.trim());
      })
      .filter(function (num) {
        return !isNaN(num) && isFinite(num) && num >= 0;
      });
    if (!values.length) {
      return null;
    }
    var max = values.reduce(function (acc, val) {
      return val > acc ? val : acc;
    }, 0);
    // Normalize 0..1 values or >1 percentages into 0..1.
    var scale = max > 1 ? (max > 100 ? max : 100) : 1;
    return values.map(function (val) {
      return Math.max(0.12, Math.min(1, val / scale));
    });
  }

  function getWaveformWidth(wave) {
    if (!wave) {
      return 0;
    }
    if (typeof wave.getBoundingClientRect === 'function') {
      var rect = wave.getBoundingClientRect();
      if (rect && rect.width > 0) {
        return rect.width;
      }
    }
    return wave.clientWidth || 0;
  }

  function getWaveformBarCount(wave, requestedBars) {
    var waveWidth = getWaveformWidth(wave);
    if (!waveWidth || waveWidth <= 0) {
      return requestedBars;
    }
    var gap = 2;
    if (typeof window.getComputedStyle === 'function') {
      var style = window.getComputedStyle(wave);
      if (style) {
        var parsedGap = parseFloat(style.columnGap || style.gap);
        if (isFinite(parsedGap) && parsedGap >= 0) {
          gap = parsedGap;
        }
      }
    }
    var minBarWidth = 2;
    var maxBars = Math.max(1, Math.floor((waveWidth + gap) / (minBarWidth + gap)));
    return Math.min(requestedBars, maxBars);
  }

  function resamplePeaks(values, targetCount) {
    if (!values || !values.length || targetCount >= values.length) {
      return values;
    }
    var resampled = [];
    for (var i = 0; i < targetCount; i++) {
      var start = Math.floor((i * values.length) / targetCount);
      var end = Math.max(start + 1, Math.floor(((i + 1) * values.length) / targetCount));
      var peak = 0;
      for (var j = start; j < end && j < values.length; j++) {
        if (values[j] > peak) {
          peak = values[j];
        }
      }
      resampled.push(peak);
    }
    return resampled;
  }

  function renderWaveform(wave) {
    if (!wave) {
      return;
    }
    var peaks = parsePeaks(wave.getAttribute('data-peaks'));
    var requestedBars = peaks ? peaks.length : parseInt(wave.getAttribute('data-bars') || '72', 10);
    var progress = parseFloat(wave.getAttribute('data-progress') || '0');
    var rand = seededRandom(parseInt(wave.getAttribute('data-seed') || '7', 10));
    var values = [];
    if (peaks) {
      values = peaks;
    } else {
      for (var i = 0; i < requestedBars; i++) {
        var envelope = 0.45 + 0.55 * Math.sin((i / requestedBars) * Math.PI);
        values.push(Math.max(0.12, envelope * (0.35 + rand() * 0.65)));
      }
    }
    var targetBars = getWaveformBarCount(wave, requestedBars);
    var barHeights = resamplePeaks(values, targetBars);
    var fragment = document.createDocumentFragment();
    wave.textContent = '';
    for (var k = 0; k < barHeights.length; k++) {
      var bar = document.createElement('span');
      bar.style.height = Math.round(barHeights[k] * 100) + '%';
      if (progress > 0 && k / barHeights.length < progress) {
        if (bar.classList) {
          bar.classList.add('played');
        } else {
          bar.className = 'played';
        }
      }
      fragment.appendChild(bar);
    }
    wave.appendChild(fragment);
    wave._renderedBarCount = barHeights.length;
  }

  function setWaveformProgress(wave, ratio) {
    if (!wave) {
      return;
    }
    var clamped = Math.max(0, Math.min(1, isFinite(ratio) ? ratio : 0));
    wave.setAttribute('data-progress', String(clamped));
    if (wave.getAttribute('role') === 'slider') {
      wave.setAttribute('aria-valuenow', String(Math.round(clamped * 100)));
    }
    var bars = wave.querySelectorAll ? wave.querySelectorAll('span') : [];
    var total = bars.length;
    for (var i = 0; i < total; i++) {
      var isPlayed = clamped > 0 && i / total < clamped;
      if (bars[i].classList) {
        bars[i].classList.toggle('played', isPlayed);
      } else {
        bars[i].className = isPlayed ? 'played' : '';
      }
    }
  }

  function initWaveforms() {
    var waves = document.querySelectorAll('[data-waveform]');
    waves.forEach(function (wave) {
      renderWaveform(wave);
    });

    function syncWaveformSize(wave) {
      if (!wave) {
        return;
      }
      var peaks = parsePeaks(wave.getAttribute('data-peaks'));
      var requestedBars = peaks ? peaks.length : parseInt(wave.getAttribute('data-bars') || '72', 10);
      var nextBars = getWaveformBarCount(wave, requestedBars);
      if (nextBars !== wave._renderedBarCount) {
        renderWaveform(wave);
      }
    }

    if (typeof window.ResizeObserver === 'function') {
      var observer = new window.ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
          syncWaveformSize(entry.target);
        });
      });
      waves.forEach(function (wave) {
        observer.observe(wave);
      });
    } else if (typeof window.addEventListener === 'function') {
      var resizeTimer = null;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          waves.forEach(syncWaveformSize);
        }, 100);
      });
    }
  }

  function formatTime(seconds) {
    if (typeof seconds !== 'number' || !isFinite(seconds) || seconds < 0) {
      return '0:00';
    }
    var total = Math.floor(seconds);
    var mins = Math.floor(total / 60);
    var secs = total % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  function resolveAudioUrl(base, file, src) {
    var trimmedSrc = (src || '').trim();
    if (trimmedSrc) {
      return trimmedSrc;
    }
    var trimmedFile = (file || '').trim();
    if (!trimmedFile) {
      return '';
    }
    if (/^https?:\/\//i.test(trimmedFile) || trimmedFile.charAt(0) === '/' || trimmedFile.charAt(0) === '.') {
      return trimmedFile;
    }
    var normalizedBase = (base || '').trim();
    if (normalizedBase && normalizedBase.slice(-1) !== '/') {
      normalizedBase += '/';
    }
    var encodedFile = trimmedFile
      .split('/')
      .map(function (segment) {
        try {
          return encodeURIComponent(decodeURIComponent(segment));
        } catch (e) {
          return encodeURIComponent(segment);
        }
      })
      .join('/');
    return normalizedBase + encodedFile;
  }

  function setButtonIcon(button, iconClass) {
    if (!button) {
      return;
    }
    var icon = button.querySelector('i');
    if (icon) {
      icon.className = 'fa ' + iconClass;
    }
  }

  function initAudioPlayers() {
    var players = document.querySelectorAll('[data-audio-player]');
    if (!players || !players.length) {
      return;
    }

    players.forEach(function (player) {
      var audioBase = player.getAttribute('data-audio-base') || '';
      var playBtn = player.querySelector('[data-play-toggle]');
      var wave = player.querySelector('[data-waveform]');
      var coverEl = player.querySelector('[data-player-cover]');
      var kickerEl = player.querySelector('[data-player-kicker]');
      var titleEl = player.querySelector('[data-player-title]');
      var metaEl = player.querySelector('[data-player-meta]');
      var timeEl = player.querySelector('[data-player-time]');
      var spotifyEl = player.querySelector('[data-player-spotify]');
      var trackListSelector = player.getAttribute('data-track-list');
      var trackList = trackListSelector ? document.querySelector(trackListSelector) : null;
      var rowButtons = trackList ? trackList.querySelectorAll('[data-release-play]') : [];

      var audio = null;
      var loadedUrl = '';
      var currentUrl = resolveAudioUrl(
        audioBase,
        player.getAttribute('data-audio-file'),
        player.getAttribute('data-audio-src')
      );
      var currentTitle = player.getAttribute('data-track-title') || (titleEl ? titleEl.textContent.trim() : 'Track');
      var currentDurationLabel = player.getAttribute('data-track-duration') || '0:00';
      var activeRow = trackList ? trackList.querySelector('.release.is-active') : null;
      var initialActiveRow = activeRow;
      var initialKicker = kickerEl ? kickerEl.textContent.trim() : 'Featured Track';
      var isLoading = false;
      var pendingSeekRatio = null;
      var pendingResumeTime = null;
      var retriedExpiredUrl = false;

      function updateTimeDisplay(currentSec, durationSec) {
        if (!timeEl) {
          return;
        }
        var totalLabel = isFinite(durationSec) && durationSec > 0 ? formatTime(durationSec) : currentDurationLabel;
        timeEl.textContent = totalLabel
          ? formatTime(currentSec || 0) + ' / ' + totalLabel
          : formatTime(currentSec || 0);
      }

      function syncPlayState() {
        var isPlaying = Boolean(audio && !audio.paused && !audio.ended && loadedUrl === currentUrl);
        if (playBtn) {
          if (playBtn.classList) {
            playBtn.classList.toggle('is-playing', isPlaying);
            playBtn.classList.toggle('is-loading', isLoading);
          }
          playBtn.setAttribute('aria-pressed', String(isPlaying));
          playBtn.setAttribute('aria-label', (isPlaying ? 'Pause ' : 'Play ') + currentTitle);
          setButtonIcon(playBtn, isLoading ? 'fa-spinner fa-spin' : (isPlaying ? 'fa-pause' : 'fa-play'));
        }

        rowButtons.forEach(function (btn) {
          var row = btn.closest ? btn.closest('.release') : null;
          var isRowActive = Boolean(row && row === activeRow);
          var isRowPlaying = isRowActive && isPlaying;
          var isRowLoading = isRowActive && isLoading;
          var rowTitleEl = row ? row.querySelector('.release-title') : null;
          var rowTitle = rowTitleEl ? rowTitleEl.textContent.trim() : 'track';

          if (btn.classList) {
            btn.classList.toggle('is-playing', isRowPlaying);
            btn.classList.toggle('is-loading', isRowLoading);
          }
          btn.setAttribute('aria-pressed', String(isRowPlaying));
          btn.setAttribute('aria-label', (isRowPlaying ? 'Pause ' : 'Play ') + rowTitle);
          setButtonIcon(btn, isRowLoading ? 'fa-spinner fa-spin' : (isRowPlaying ? 'fa-pause' : 'fa-play'));
        });
      }

      function ensureAudio() {
        if (audio) {
          return audio;
        }
        if (typeof window.Audio !== 'function') {
          showToast('Audio playback is not supported in this browser.');
          return null;
        }
        audio = new window.Audio();
        audio.preload = 'none';

        audio.addEventListener('loadstart', function () {
          isLoading = true;
          syncPlayState();
        });
        audio.addEventListener('waiting', function () {
          isLoading = true;
          syncPlayState();
        });
        audio.addEventListener('canplay', function () {
          isLoading = false;
          syncPlayState();
        });
        audio.addEventListener('playing', function () {
          isLoading = false;
          syncPlayState();
        });
        audio.addEventListener('pause', function () {
          isLoading = false;
          syncPlayState();
        });
        audio.addEventListener('loadedmetadata', function () {
          if (pendingResumeTime !== null && isFinite(audio.duration) && audio.duration > 0) {
            audio.currentTime = Math.min(pendingResumeTime, audio.duration);
            pendingResumeTime = null;
          } else if (pendingSeekRatio !== null && isFinite(audio.duration) && audio.duration > 0) {
            audio.currentTime = pendingSeekRatio * audio.duration;
            pendingSeekRatio = null;
          }
          if (isFinite(audio.duration) && audio.duration > 0) {
            currentDurationLabel = formatTime(audio.duration);
          }
          updateTimeDisplay(audio.currentTime || 0, audio.duration);
        });
        audio.addEventListener('timeupdate', function () {
          if (isFinite(audio.duration) && audio.duration > 0) {
            setWaveformProgress(wave, audio.currentTime / audio.duration);
            updateTimeDisplay(audio.currentTime, audio.duration);
          }
        });
        audio.addEventListener('ended', function () {
          isLoading = false;
          setWaveformProgress(wave, 0);
          updateTimeDisplay(0, audio.duration);
          syncPlayState();
        });
        audio.addEventListener('error', function () {
          // Retry once if playback errors mid-track (e.g. a transient network hiccup or expired remote URL).
          if (!retriedExpiredUrl && audio.currentTime > 0 && currentUrl) {
            retriedExpiredUrl = true;
            pendingResumeTime = audio.currentTime;
            audio.src = currentUrl;
            if (typeof audio.load === 'function') {
              audio.load();
            }
            var retryPromise = audio.play();
            if (retryPromise && typeof retryPromise.catch === 'function') {
              retryPromise.catch(function () {});
            }
            return;
          }
          loadedUrl = '';
          pendingSeekRatio = null;
          pendingResumeTime = null;
          isLoading = false;
          syncPlayState();
          var hasSpotifyLink = Boolean(spotifyEl && !spotifyEl.hidden && spotifyEl.getAttribute('href') && spotifyEl.getAttribute('href') !== '#');
          showToast(
            hasSpotifyLink
              ? 'Audio preview unavailable right now \u2014 listen on Spotify or check back soon.'
              : 'Audio preview unavailable right now \u2014 check back soon.'
          );
        });

        return audio;
      }

      function togglePlay() {
        if (!currentUrl) {
          showToast('Audio preview coming soon!');
          return;
        }
        var instance = ensureAudio();
        if (!instance) {
          return;
        }
        if (loadedUrl !== currentUrl) {
          loadedUrl = currentUrl;
          retriedExpiredUrl = false;
          isLoading = true;
          instance.src = currentUrl;
          syncPlayState();
        }
        if (instance.paused || instance.ended) {
          track(player.getAttribute('data-analytics-event') || 'production_audio_play', {
            event_category: player.getAttribute('data-analytics-category') || 'production',
            event_label: currentTitle,
          });
          var playPromise = instance.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function (err) {
              if (err && err.name === 'AbortError') {
                return;
              }
              isLoading = false;
              syncPlayState();
            });
          }
        } else {
          instance.pause();
        }
      }

      function loadTrackFromRow(row, autoPlay) {
        if (!row) {
          return;
        }
        var nextUrl = resolveAudioUrl(
          audioBase,
          row.getAttribute('data-audio-file'),
          row.getAttribute('data-audio-src')
        );
        if (!nextUrl) {
          showToast('Audio preview coming soon!');
          return;
        }

        if (trackList) {
          trackList.querySelectorAll('.release.is-active').forEach(function (item) {
            item.classList.remove('is-active');
          });
        }
        row.classList.add('is-active');
        activeRow = row;

        var rowTitleEl = row.querySelector('.release-title');
        var rowMetaEl = row.querySelector('.release-meta');
        var rowCoverImg = row.querySelector('.cover img');
        var rowCover = row.querySelector('.cover');
        var rowSpotify = row.querySelector('.release-links a[href^="http"]');

        currentUrl = nextUrl;
        currentTitle = rowTitleEl ? rowTitleEl.textContent.trim() : 'Track';
        currentDurationLabel = row.getAttribute('data-track-duration') || '';
        pendingSeekRatio = null;
        pendingResumeTime = null;
        retriedExpiredUrl = false;

        if (kickerEl) {
          kickerEl.textContent =
            row.getAttribute('data-track-kicker') ||
            (initialActiveRow && row === initialActiveRow ? initialKicker : 'Now playing');
        }
        if (titleEl) {
          titleEl.textContent = currentTitle;
        }
        if (metaEl && rowMetaEl) {
          metaEl.textContent = rowMetaEl.textContent.trim();
        }
        if (coverEl) {
          coverEl.textContent = '';
          if (rowCoverImg) {
            coverEl.classList.add('has-art');
            var img = document.createElement('img');
            img.src = rowCoverImg.getAttribute('src') || '';
            img.alt = rowCoverImg.getAttribute('alt') || currentTitle + ' cover art';
            coverEl.appendChild(img);
          } else {
            coverEl.classList.remove('has-art');
            coverEl.textContent = rowCover ? rowCover.textContent.trim() : 'ROVA';
          }
        }
        if (spotifyEl) {
          if (rowSpotify) {
            spotifyEl.hidden = false;
            spotifyEl.setAttribute('href', rowSpotify.getAttribute('href') || '#');
            spotifyEl.setAttribute('data-analytics-label', 'Featured ' + currentTitle + ' Spotify');
          } else {
            spotifyEl.hidden = true;
          }
        }
        if (wave) {
          var peaks = row.getAttribute('data-peaks');
          var seed = row.getAttribute('data-seed') || '42';
          if (peaks) {
            wave.setAttribute('data-peaks', peaks);
          } else {
            wave.removeAttribute('data-peaks');
          }
          wave.setAttribute('data-seed', seed);
          wave.setAttribute('data-progress', '0');
          renderWaveform(wave);
          setWaveformProgress(wave, 0);
        }
        updateTimeDisplay(0, NaN);

        if (audio && !audio.paused) {
          audio.pause();
        }
        loadedUrl = '';
        isLoading = false;
        syncPlayState();

        if (autoPlay) {
          togglePlay();
        }
      }

      function seekToRatio(ratio) {
        var clamped = Math.max(0, Math.min(1, ratio));
        setWaveformProgress(wave, clamped);
        if (audio && loadedUrl === currentUrl && isFinite(audio.duration) && audio.duration > 0) {
          audio.currentTime = clamped * audio.duration;
          updateTimeDisplay(audio.currentTime, audio.duration);
        } else {
          pendingSeekRatio = clamped;
          togglePlay();
        }
      }

      if (playBtn) {
        playBtn.addEventListener('click', function () {
          togglePlay();
        });
      }

      if (wave) {
        wave.addEventListener('click', function (event) {
          var rect = wave.getBoundingClientRect ? wave.getBoundingClientRect() : null;
          if (!rect || !rect.width) {
            return;
          }
          var ratio = (event.clientX - rect.left) / rect.width;
          seekToRatio(ratio);
        });
        wave.addEventListener('keydown', function (event) {
          if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            togglePlay();
          } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            if (audio && loadedUrl === currentUrl && isFinite(audio.duration) && audio.duration > 0) {
              event.preventDefault();
              var delta = event.key === 'ArrowRight' ? 5 : -5;
              var nextTime = Math.max(0, Math.min(audio.duration, audio.currentTime + delta));
              audio.currentTime = nextTime;
              setWaveformProgress(wave, nextTime / audio.duration);
              updateTimeDisplay(nextTime, audio.duration);
            }
          } else if (event.key === 'Home' || event.key === 'End') {
            if (audio && loadedUrl === currentUrl && isFinite(audio.duration) && audio.duration > 0) {
              event.preventDefault();
              var targetTime = event.key === 'End' ? audio.duration : 0;
              audio.currentTime = targetTime;
              setWaveformProgress(wave, targetTime / audio.duration);
              updateTimeDisplay(targetTime, audio.duration);
            }
          }
        });
      }

      rowButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          var row = button.closest ? button.closest('.release') : null;
          if (!row) {
            return;
          }
          if (row === activeRow) {
            togglePlay();
          } else {
            loadTrackFromRow(row, true);
          }
        });
      });

      syncPlayState();
    });
  }

  function initFilters() {
    document.querySelectorAll('[data-filter-group]').forEach(function (group) {
      var targetSelector = group.getAttribute('data-filter-group');
      var emptySelector = group.getAttribute('data-filter-empty');
      var emptyEl = emptySelector ? document.querySelector(emptySelector) : null;
      var emptyTitleEl = emptyEl ? emptyEl.querySelector('[data-empty-title]') : null;
      var buttons = group.querySelectorAll('[data-filter]');
      var subGroups = Array.prototype.slice.call(
        document.querySelectorAll('[data-subfilter-group]')
      ).filter(function (subGroup) {
        return subGroup.getAttribute('data-subfilter-group') === targetSelector;
      });
      var activeFilter = 'all';
      var activeSubfilter = 'all';
      var initialButton = null;
      buttons.forEach(function (button) {
        if (!initialButton && button.getAttribute('aria-pressed') === 'true') {
          initialButton = button;
        }
      });
      if (!initialButton && buttons.length) {
        initialButton = buttons[0];
      }
      var activeButtonRef = initialButton;

      function updateVisibility() {
        var visibleCount = 0;
        document.querySelectorAll(targetSelector + ' [data-category]').forEach(function (item) {
          var categories = item.getAttribute('data-category').split(' ');
          var matchesCategory = activeFilter === 'all' || categories.indexOf(activeFilter) !== -1;
          var matchesSub = activeSubfilter === 'all' || item.getAttribute('data-subcategory') === activeSubfilter;
          var isHidden = !(matchesCategory && matchesSub);
          item.hidden = isHidden;
          if (!isHidden) {
            visibleCount++;
          }
        });
        if (emptyEl) {
          emptyEl.hidden = visibleCount > 0;
          if (visibleCount === 0 && emptyTitleEl && activeButtonRef) {
            emptyTitleEl.textContent = activeButtonRef.textContent.trim() + ' \u2014 coming soon';
          }
        }
      }

      function syncSubGroups() {
        subGroups.forEach(function (subGroup) {
          var isMatch = subGroup.getAttribute('data-subfilter-for') === activeFilter;
          subGroup.hidden = !isMatch;
          subGroup.querySelectorAll('[data-subfilter]').forEach(function (subBtn) {
            subBtn.setAttribute('aria-pressed', String(subBtn.getAttribute('data-subfilter') === 'all'));
          });
        });
      }

      function applyFilter(activeButton) {
        activeButtonRef = activeButton;
        activeFilter = activeButton.getAttribute('data-filter');
        activeSubfilter = 'all';
        buttons.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === activeButton));
        });
        syncSubGroups();
        updateVisibility();
      }

      buttons.forEach(function (button) {
        button.addEventListener('click', function () {
          applyFilter(button);
        });
      });

      subGroups.forEach(function (subGroup) {
        var subButtons = subGroup.querySelectorAll('[data-subfilter]');
        subButtons.forEach(function (subBtn) {
          subBtn.addEventListener('click', function () {
            activeSubfilter = subBtn.getAttribute('data-subfilter') || 'all';
            subButtons.forEach(function (b) {
              b.setAttribute('aria-pressed', String(b === subBtn));
            });
            updateVisibility();
          });
        });
      });

      if (initialButton) {
        applyFilter(initialButton);
      } else {
        updateVisibility();
      }
    });
  }

  function initNav() {
    var nav = document.querySelector('.topnav');
    if (!nav || nav.hasAttribute('data-custom-nav')) {
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
    initAudioPlayers();
    initFilters();
    initNav();
    initReveal();
    initYear();
  });
})();
