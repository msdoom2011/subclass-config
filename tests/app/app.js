var app = Subclass.createModule('app', {
    dataTypes: {
        percents: { type: "string", pattern: /^[a-z]+%$/ },
        bigNumber: { type: "number", minValue: 1000000 },
        //number: { type: "number", maxValue: -10000 }
    }
});