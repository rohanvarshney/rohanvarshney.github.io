const test = require('node:test');
const assert = require('assert');

const { BrowserDetect } = require('../assets/js/material-kit.js');

const mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

test('BrowserDetect.searchString', async (t) => {
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
