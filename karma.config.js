// Karma configuration
// Generated on Wed Mar 11 2015 16:47:31 GMT+0200 (EET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [

      // Src Files
      "vendors/subclass.js",
      "src/PropertyManager.js",
      "src/DataTypeManager.js",
      "src/PropertyType.js",
      "src/PropertyDefinition.js",
      "src/PropertyAPI.js",
      "src/Type/Collection/CollectionType.js",
      "src/Type/Collection/CollectionManager.js",
      "src/Type/Collection/*.js",
      "src/Type/Collection/*Collection/*Type.js",
      "src/Type/Collection/*Collection/*.js",
      "src/Type/**/*.js",
      "src/**/*.js",

      // Tests
      "tests/plugs/app-first-plugin.js",
      "tests/plugs/app-forth-plugin.js",
      "tests/plugs/app-third-plugin.js",
      "tests/plugs/app-second-plugin.js",
      "tests/app/app.js",
      "tests/app/**/*.js",
      "tests/main.js",
      "tests/test.js"
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome'], //, 'Firefox', 'Safari'],
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
