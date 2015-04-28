describe("Testing function property type with its", function() {

    //var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var classInst = window.classInstAdvanced;
    var prop = classInst.getProperty('propFunction');

    it ("default value", function() {
        expect(prop.getDefaultValue()()).toBe(true);
    });

    it ("value", function() {
        expect(classInst.getPropFunction()()).toBe(false);
        expect(prop.getValue()()).toBe(false);
    });

    it ("ability to set new value", function() {
        classInst.setPropFunction(function() { return 60; });
        expect(classInst.getPropFunction()()).toBe(60);
        expect(function() { classInst.setPropFunction(100); }).toThrow();
        expect(function() { classInst.setPropFunction("100"); }).toThrow();
        expect(classInst.getPropFunction()()).toBe(60);
    });

    it ("nullable", function() {
        classInst.setPropFunction(null);
        expect(classInst.getPropFunction()).toBe(null);
        classInst.setPropFunction(function() { return 50; });
        expect(classInst.getPropFunction()()).toBe(50);
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropFunction(function() { return 60; });
        expect(classInst.getPropFunction()()).toBe(50);
        prop.unlock();
        classInst.setPropFunction(function() { return 60; });
        expect(classInst.getPropFunction()()).toBe(60);
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropFunction).toBe(true);
        expect(classInst.propFunctionOld()).toBe(50);
        expect(classInst.propFunctionNew()).toBe(60);
    });
});