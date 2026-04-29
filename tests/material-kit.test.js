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
