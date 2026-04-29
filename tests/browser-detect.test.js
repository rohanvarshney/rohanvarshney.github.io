const test = require('node:test');
const assert = require('node:assert');
const { BrowserDetect } = require('../assets/js/material-kit.js');

test('BrowserDetect.searchVersion', async (t) => {
  await t.test('should parse Chrome version', () => {
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    BrowserDetect.versionSearchString = "Chrome";
    const version = BrowserDetect.searchVersion(userAgent);
    assert.strictEqual(version, 91.0);
  });

  await t.test('should parse Firefox version', () => {
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0";
    BrowserDetect.versionSearchString = "Firefox";
    const version = BrowserDetect.searchVersion(userAgent);
    assert.strictEqual(version, 89.0);
  });

  await t.test('should parse Safari version', () => {
    const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15";
    // In BrowserDetect.dataBrowser, Safari's subString is "Safari"
    // But Version/14.1.1 is what it usually looks for for version if it's Safari?
    // Let's check how BrowserDetect handles it.
    // dataBrowser says subString: "Safari".
    // searchVersion will look for "Safari" + 1 index.
    // UA has "Safari/605.1.15". searchVersion will return parseFloat("605.1.15") -> 605.1
    BrowserDetect.versionSearchString = "Safari";
    const version = BrowserDetect.searchVersion(userAgent);
    assert.strictEqual(version, 605.1);
  });

  await t.test('should parse Trident (IE11) version using rv:', () => {
    const userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko";
    BrowserDetect.versionSearchString = "Trident";
    const version = BrowserDetect.searchVersion(userAgent);
    assert.strictEqual(version, 11.0);
  });

  await t.test('should return undefined if versionSearchString not found', () => {
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";
    BrowserDetect.versionSearchString = "Opera";
    const version = BrowserDetect.searchVersion(userAgent);
    assert.strictEqual(version, undefined);
  });

  await t.test('should handle multiple occurrences and pick the first one matching versionSearchString', () => {
     const dataString = "SomeBrowser/1.2.3 Other/4.5.6";
     BrowserDetect.versionSearchString = "SomeBrowser";
     const version = BrowserDetect.searchVersion(dataString);
     assert.strictEqual(version, 1.2);
  });
});
