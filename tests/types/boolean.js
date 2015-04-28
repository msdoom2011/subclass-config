describe("Testing boolean property type with its", function() {

    //var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var classInst = window.classInstAdvanced;
    var prop = classInst.getProperty('propBoolean');

    it ("default value", function() {
        expect(prop.getDefaultValue()).toBe(false);
    });

    it ("value", function() {
        expect(classInst.getPropBoolean()).toBe(true);
        expect(prop.getValue()).toBe(true);
    });

    it ("ability to set new value", function() {
        classInst.setPropBoolean(false);
        expect(classInst.getPropBoolean()).toBe(false);
        expect(function() { classInst.setPropBoolean(100); }).toThrow();
        expect(function() { classInst.setPropBoolean("100"); }).toThrow();
        expect(classInst.getPropBoolean()).toBe(false);
    });

    it ("nullable", function() {
        classInst.setPropBoolean(null);
        expect(classInst.getPropBoolean()).toBe(null);
        classInst.setPropBoolean(true);
        expect(classInst.getPropBoolean()).toBe(true);
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropBoolean(false);
        expect(classInst.getPropBoolean()).toBe(true);
        prop.unlock();
        classInst.setPropBoolean(false);
        expect(classInst.getPropBoolean()).toBe(false);
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropBoolean).toBe(true);
        expect(classInst.propBooleanOld).toBe(true);
        expect(classInst.propBooleanNew).toBe(false);
    });
});