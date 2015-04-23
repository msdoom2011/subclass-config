describe("Testing string property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propString');

    it ("default value", function() {
        expect(prop.getDefaultValue()).toBe('0%');
    });

    it ("value", function() {
        expect(classInst.getPropString()).toBe('10%');
        expect(prop.getValue()).toBe('10%');
    });

    it ("ability to set new value", function() {
        classInst.setPropString("20%");
        expect(classInst.getPropString()).toBe("20%");
        expect(function() { classInst.setPropString("60"); }).toThrow();
        expect(function() { classInst.setPropString(60); }).toThrow();
    });

    it ("nullable", function() {
        classInst.setPropString(null);
        expect(classInst.getPropString()).toBe(null);
        classInst.setPropString("50%");
        expect(classInst.getPropString()).toBe("50%");
    });

    it ("ability to throw error if trying to set string value which length is less then allowed minimum", function() {
        expect(function() { classInst.setPropString("%"); }).toThrow();
        expect(classInst.getPropString()).toBe("50%");
    });

    it ("ability to throw error if trying to set string value which length is more then allowed maximum", function() {
        expect(function() { classInst.setPropString("200%"); }).toThrow();
        expect(classInst.getPropString()).toBe("50%");
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropString("60%");
        expect(classInst.getPropString()).toBe("50%");
        prop.unlock();
        classInst.setPropString("60%");
        expect(classInst.getPropString()).toBe("60%");
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropString).toBe(true);
        expect(classInst.propStringOld).toBe("50%");
        expect(classInst.propStringNew).toBe("60%");
    });
});