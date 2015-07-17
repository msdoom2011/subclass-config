app.registerConfig('Config/StandardConfig', {

    $_extends: "Config/BaseConfig",

    propNumber: 1000,

    propString: "standard string",

    stPropNumber: { type: "number", default: 10 },

    stPropString: { type: "string", default: "str" }

});