describe("Testing class property type with its", function() {

    app.registerClass("Class/AppClassFalse", {});

    //var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var classInst = window.classInstAdvanced;
    var prop = classInst.getProperty('propClass');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("default value", function() {
        expect(prop.getDefaultValue()).toBe(null);
    });

    it ("value", function() {
        expect(classInst.getPropClass()).toBe(null);
        expect(prop.getValue()).toBe(null);
    });

    it ("ability to set new value", function() {
        classInst.setPropClass(app.getClass('Class/AppClass').createInstance(60));
        expect(classInst.getPropClass().value).toBe(60);
        expect(function() { classInst.setPropClass(app.getClass('Class/AppClassFalse').createInstance()); }).toThrow();
        expect(function() { classInst.setPropClass("60"); }).toThrow();
        expect(function() { classInst.setPropClass(true); }).toThrow();
    });

    it ("nullable", function() {
        classInst.setPropClass(null);
        expect(classInst.getPropClass()).toBe(null);
        classInst.setPropClass(app.getClass('Class/AppClass').createInstance(50));
        expect(classInst.getPropClass().value).toBe(50);
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropClass(app.getClass('Class/AppClass').createInstance(60));
        expect(classInst.getPropClass().value).toBe(50);
        prop.unlock();
        classInst.setPropClass(app.getClass('Class/AppClass').createInstance(60));
        expect(classInst.getPropClass().value).toBe(60);
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropClass).toBe(true);
        expect(classInst.propClassOld.value).toBe(50);
        expect(classInst.propClassNew.value).toBe(60);
    });
});