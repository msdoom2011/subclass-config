app.registerConfig("Config/AdvancedConfig", {

    $_final: true,

    $_extends: "Config/StandardConfig",

    $_includes: ['Config/StandardIncludeConfig'],

    incPropNumber: { type: 'number', value: 500, extends: true }

});