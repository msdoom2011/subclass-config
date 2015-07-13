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
      //"src/DataTypeManager.js",
      "src/PropertyType.js",
      "src/Property.js",
      //"src/PropertyDefinition.js",
      //"src/PropertyAPI.js",
      "src/Error/Option/*.js",
      "src/Error/**/*.js",
      "src/Extension/**/*.js",
      "src/Type/Number/*.js",
      "src/Type/String/*.js",
      "src/Type/Boolean/*.js",
      "src/Type/Array/*.js",
      "src/Type/Object/*.js",
      "src/Type/Class/*.js",
      "src/Type/Enum/*.js",
      "src/Type/Function/*.js",
      "src/Type/Mixed/*.js",
      "src/Type/Untyped/*.js",
      "src/Type/Constructor/*.js",
      "src/Type/Map/MapType.js",
      "src/Type/Map/*.js",
      "src/Type/Collection/CollectionType.js",
      "src/Type/Collection/*.js",
      "src/Type/Collection/**/*",
      //"src/Type/**/*.js",
      "src/*.js",

      // Tests
      //"tests/plugs/app-first-plugin.js",
      //"tests/plugs/app-forth-plugin.js",
      //"tests/plugs/app-third-plugin.js",
      //"tests/plugs/app-second-plugin.js",
      "tests/app/app.js",
      "tests/app/**/*.js",
      "tests/main.js",
      "tests/def_base.js",
      "tests/def_standard.js",
      "tests/def_advanced.js",
      "tests/types/number.js",
      "tests/types/string.js",
      "tests/types/boolean.js",
      "tests/types/array.js",
      "tests/types/object.js",
      "tests/types/class.js",
      "tests/types/enum.js",
      "tests/types/function.js",
      "tests/types/mixed.js",
      "tests/types/untyped.js",
      "tests/types/constructor.js",
      "tests/types/map.js",
      "tests/types/arrayCollectionString.js",
      "tests/types/arrayCollectionMap.js",
      "tests/types/arrayCollectionArray.js"

      //"tests/types/**/*.js"
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
