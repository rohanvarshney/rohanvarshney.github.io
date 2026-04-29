let cssCalls = 0;
global.big_image = {
    css: function() {
        cssCalls++;
        // Simulate some DOM layout/style work
        let temp = 0;
        for(let i=0; i<100; i++) temp += i;
    }
};

let scrollTopVal = 0;
global.$ = function(selector) {
    if (selector === window) {
        return {
            scrollTop: function() { return scrollTopVal; }
        }
    }
    return {};
};

let frames = [];
global.window = {
    requestAnimationFrame: function(cb) {
        frames.push(cb);
    }
};

let materialKit = {
  misc: {},
  checkScrollForParallax: function() {
    if (!materialKit.misc.isAnimating) {
      materialKit.misc.isAnimating = true;
      window.requestAnimationFrame(function() {
        let oVal = ($(window).scrollTop() / 3);
        big_image.css({
          'transform': 'translate3d(0,' + oVal + 'px,0)',
          '-webkit-transform': 'translate3d(0,' + oVal + 'px,0)',
          '-ms-transform': 'translate3d(0,' + oVal + 'px,0)',
          '-o-transform': 'translate3d(0,' + oVal + 'px,0)'
        });
        materialKit.misc.isAnimating = false;
      });
    }
  }
};

function runBenchmark(iterations) {
    let start = performance.now();
    for (let i = 0; i < iterations; i++) {
        scrollTopVal += 1;
        materialKit.checkScrollForParallax();

        // flush frames occasionally to simulate browser repaints
        if (i % 100 === 0) {
            let f = frames;
            frames = [];
            f.forEach(cb => cb());
        }
    }
    // flush final frames
    let f = frames;
    frames = [];
    f.forEach(cb => cb());

    let end = performance.now();
    console.log(`Optimized Execution time for ${iterations} calls: ${end - start} ms`);
    console.log(`CSS calls: ${cssCalls}`);
}

runBenchmark(100000);
