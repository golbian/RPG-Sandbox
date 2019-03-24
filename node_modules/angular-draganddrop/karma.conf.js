module.exports = function (config) {
  config.set({
    plugins: [
      'karma-mocha',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
    ],
    frameworks: ['mocha'],
    singleRun: false,
    autoWatch: true,
    colors: true,
    reporters: ['dots'],
    browsers: [process.env.TRAVIS ? 'Firefox' : 'Chrome'],
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',

      'node_modules/sinon/pkg/sinon.js',
      'node_modules/chai/chai.js',
      'node_modules/chai-jquery/chai-jquery.js',
      'node_modules/sinon-chai/lib/sinon-chai.js',

      'angular-draganddrop.js',
      'test/*.js'
    ],
    logLevel: config.LOG_ERROR
  });
};
