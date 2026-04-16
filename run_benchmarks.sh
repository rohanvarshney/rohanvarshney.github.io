echo "Baseline:"
node benchmark.js
git checkout assets/js/material-kit.js
sed -i 's/$('\''html'\'')/$html/g' assets/js/material-kit.js
sed -i '/\$(document).on('\''click'\'', '\''.navbar-toggler'\'', function() {/a\  var $html = $("html");' assets/js/material-kit.js
echo "Optimized:"
node benchmark.js
