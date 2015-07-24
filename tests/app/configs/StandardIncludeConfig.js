app.registerConfig("Config/StandardIncludeConfig", {

    $_extends: "Config/BaseIncludeConfig",

    incPropNumber: { type: "number", default: 300, extends: true },

    incPropArray: [ "array" ],

    propNumber: { type: "number", value: 2000, extends: true }

});