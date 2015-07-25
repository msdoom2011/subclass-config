app.registerTrait('Class/StandardTrait', {

    $_extends: "Class/BaseTrait",

    $_properties: {

        trPropNumber: { type: 'number', value: 30, extends: true },

        trPropString: [ 'string', 'new string value']
    }
});