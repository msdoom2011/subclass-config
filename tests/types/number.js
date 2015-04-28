describe("Testing number property type with its", function() {

    //var classInst = window.classInstAdvanced;
    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
        classInst._psix = 10;
    var classInstElse = app.getClass('Class/AdvancedDefinition').createInstance();
        classInstElse._psix = 20;
    var prop = classInst.getProperty('propNumber');

    console.log(classInst.getProperty('propNumber') == classInstElse.getProperty('propNumber'));

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("default value", function() {
        expect(prop.getDefaultValue()).toBe(10);
    });

    it ("value", function() {
        expect(classInst.getPropNumber()).toBe(50);
        expect(prop.getValue()).toBe(50);
    });

    it ("ability to set new value", function() {
        classInst.setPropNumber(60);
        expect(classInst.getPropNumber()).toBe(60);
        expect(function() { classInst.setPropNumber("60"); }).toThrow();
        expect(function() { classInst.setPropNumber(true); }).toThrow();
    });

    it ("nullable", function() {
        classInst.setPropNumber(null);
        expect(classInst.getPropNumber()).toBe(null);
        classInst.setPropNumber(50);
        expect(classInst.getPropNumber()).toBe(50);
    });

    it ("ability to throw error if trying to set value which is less then allowed minimum", function() {
        expect(function() { classInst.setPropNumber(-100); }).toThrow();
        expect(classInst.getPropNumber()).toBe(50);
    });

    it ("ability to throw error if trying to set value which is more then allowed maximum", function() {
        expect(function() { classInst.setPropNumber(200); }).toThrow();
        expect(classInst.getPropNumber()).toBe(50);
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropNumber(60);
        expect(classInst.getPropNumber()).toBe(50);
        prop.unlock();
        classInst.setPropNumber(60);
        expect(classInst.getPropNumber()).toBe(60);
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropNumber).toBe(true);
        expect(classInst.propNumberOld).toBe(50);
        expect(classInst.propNumberNew).toBe(60);
    });
});