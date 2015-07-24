app.registerTrait('Class/BaseTrait', {

    $_properties: {

        trPropNumber: { type: 'number', default: 20 },

        trPropString: { type: 'string', default: 'string value' },

        propNumber: { type: 'number', minValue: 0, maxValue: 100, extends: true }

    }
});