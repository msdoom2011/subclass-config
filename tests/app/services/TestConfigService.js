app.registerClass('App/TestConfigService', {

    $_properties: {
        width: { type: "number" },
        height: { type: "number" }
    },

    $_constructor: function(width, height)
    {
        this.setWidth(width);
        this.setHeight(height);
    }
});