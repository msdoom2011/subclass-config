describe("Checking base config class", function() {

    var config = app.getClass('Config/BaseConfig').createInstance();

    it ("default values", function() {

        console.log(config.getDefaults());
        console.log(config.getValues());

    });
});