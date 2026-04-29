const test = require('node:test');
const assert = require('node:assert');

test('initFormExtendedDatetimepickers initializes datetimepicker with correct options', (t) => {
    let selectorCalled;
    let datetimepickerOptions;

    // Mock global variables needed before require
    global.document = {
        ready: function() {},
        on: function() {},
        documentMode: undefined
    };

    global.navigator = {
        userAgent: 'test'
    };

    global.$ = function(selector) {
        if (typeof selector === 'function') {
             return; // handle $(document).ready(function() { ... })
        }
        selectorCalled = selector;
        return {
            ready: function() {},
            on: function() {},
            bootstrapMaterialDesign: function() {},
            datetimepicker: function(options) {
                datetimepickerOptions = options;
            }
        };
    };

    // Make sure we have mock properties on $ just in case
    global.$.fn = {};

    const BrowserDetect = { init: function() {} };
    global.BrowserDetect = BrowserDetect;

    const { materialKit } = require('../assets/js/material-kit.js');

    materialKit.initFormExtendedDatetimepickers();

    assert.strictEqual(selectorCalled, '.datetimepicker');
    assert.deepStrictEqual(datetimepickerOptions, {
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        }
    });

    // Cleanup
    delete global.$;
    delete global.document;
    delete global.navigator;
    delete global.BrowserDetect;
});

const mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

test('BrowserDetect.searchString', async (t) => {
  const { BrowserDetect } = require('../assets/js/material-kit.js');

  await t.test('finds matching substring and returns identity', () => {
    const data = [
      {
        string: mockUserAgent,
        subString: "Chrome",
        identity: "ChromeIdentity"
      }
    ];
    const result = BrowserDetect.searchString(data);
    assert.strictEqual(result, 'ChromeIdentity');
    assert.strictEqual(BrowserDetect.versionSearchString, 'Chrome');
  });

  await t.test('returns undefined when substring is not found', () => {
    const data = [
      {
        string: mockUserAgent,
        subString: "Firefox",
        identity: "Firefox"
      }
    ];
    const result = BrowserDetect.searchString(data);
    assert.strictEqual(result, undefined);
  });

  await t.test('handles multiple entries and returns first match', () => {
    const data = [
      {
        string: mockUserAgent,
        subString: "Firefox",
        identity: "Firefox"
      },
      {
        string: mockUserAgent,
        subString: "Chrome",
        identity: "ChromeIdentity"
      },
      {
        string: mockUserAgent,
        subString: "Safari",
        identity: "SafariIdentity"
      }
    ];
    const result = BrowserDetect.searchString(data);
    assert.strictEqual(result, 'ChromeIdentity');
  });

  await t.test('returns undefined for empty array', () => {
    const data = [];
    const result = BrowserDetect.searchString(data);
    assert.strictEqual(result, undefined);
  });
});
