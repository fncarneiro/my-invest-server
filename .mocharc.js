// Mochawesome config

module.exports = {
  recursive: true,
  file: ['./test/init.js'],
  reporter: 'node_modules/mochawesome',
  timeout: 1000,
  exit: true,
  'reporter-option': [
    'autoOpen=true',
    'reportDir=test-report',
    'reportFilename=myinvest-server-test',
    'reportPageTitle=My Invest Server API Test',
    'reportTitle=My Invest Server API Test'
  ],
};

// ui: 'bdd',
// 'watch-files': ['lib/**/*.js', 'test/**/*.js'],
// 'watch-ignore': ['lib/vendor']
