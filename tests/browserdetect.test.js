const test = require('node:test');
const assert = require('node:assert');

// Mock browser globals
global.document = { documentMode: false };
global.window = {};

const { BrowserDetect } = require('../assets/js/material-kit.js');

test('BrowserDetect initialization in Chrome', (t) => {
    Object.defineProperty(global, "navigator", { value: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }, configurable: true });

    BrowserDetect.init();

    assert.strictEqual(BrowserDetect.browser, 'Chrome');
    assert.strictEqual(BrowserDetect.version, 91);
});

test('BrowserDetect initialization in Firefox', (t) => {
    Object.defineProperty(global, "navigator", { value: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        appVersion: '5.0 (Windows)'
    }, configurable: true });

    BrowserDetect.init();

    assert.strictEqual(BrowserDetect.browser, 'Firefox');
    assert.strictEqual(BrowserDetect.version, 89);
});

test('BrowserDetect initialization in Safari', (t) => {
    Object.defineProperty(global, "navigator", { value: {
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        appVersion: '5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
    }, configurable: true });

    BrowserDetect.init();

    assert.strictEqual(BrowserDetect.browser, 'Safari');
    assert.strictEqual(BrowserDetect.version, 605.1);
});

test('BrowserDetect fallback to Other and Unknown', (t) => {
    Object.defineProperty(global, "navigator", { value: {
        userAgent: 'UnknownBrowser/1.0',
        appVersion: '1.0'
    }, configurable: true });

    BrowserDetect.init();

    assert.strictEqual(BrowserDetect.browser, 'Other');
    assert.strictEqual(BrowserDetect.version, 'Unknown');
});
