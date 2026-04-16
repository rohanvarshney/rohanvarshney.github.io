const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><nav class="navbar-absolute"></nav><button class="navbar-toggler"></button></body></html>', { runScripts: "dangerously" });
const window = dom.window;
const $ = require('jquery')(window);

dom.window.$ = $;
dom.window.jQuery = $;
$.fn.bootstrapMaterialDesign = function() {}; // stub
$.fn.selectpicker = function() {}; // stub
$.fn.tooltip = function() {}; // stub
$.fn.popover = function() {}; // stub
$.fn.datetimepicker = function() {}; // stub
$.fn.tagsinput = function() {}; // stub
$.fn.flexisel = function() {}; // stub

const scriptContent = require('fs').readFileSync('assets/js/material-kit.js', 'utf-8');

// Evaluate the script in the context of the window
dom.window.eval(scriptContent);

function runBenchmark(iterations) {
  const toggler = window.$('.navbar-toggler');
  if (toggler.length === 0) {
      console.log('No toggler found');
      return;
  }

  // mock setTimeout to run immediately for benchmarking
  window.setTimeout = function(cb, ms) {
      cb();
  }

  let start = performance.now();
  for (let i = 0; i < iterations; i++) {
    toggler.trigger('click');
    toggler.trigger('click'); // Click twice to toggle back and forth
  }
  let end = performance.now();

  console.log(`Execution time for ${iterations} toggles: ${end - start} ms`);
}

runBenchmark(10000);
