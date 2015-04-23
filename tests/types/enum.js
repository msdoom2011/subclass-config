describe("Testing enum property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propEnum');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("default value", function() {
        expect(prop.getDefaultValue()).toBe('male');
    });

    it ("value", function() {
        expect(classInst.getPropEnum()).toBe("female");
        expect(prop.getValue()).toBe("female");
    });

    it ("ability to set new value", function() {
        classInst.setPropEnum("male");
        expect(classInst.getPropEnum()).toBe("male");
        expect(function() { classInst.setPropEnum("psix"); }).toThrow();
        expect(function() { classInst.setPropEnum(true); }).toThrow();
    });

    it ("nullable", function() {
        classInst.setPropEnum(null);
        expect(classInst.getPropEnum()).toBe(null);
        classInst.setPropEnum("female");
        expect(classInst.getPropEnum()).toBe("female");
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropEnum("male");
        expect(classInst.getPropEnum()).toBe("female");
        prop.unlock();
        classInst.setPropEnum("male");
        expect(classInst.getPropEnum()).toBe("male");
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropEnum).toBe(true);
        expect(classInst.propEnumOld).toBe("female");
        expect(classInst.propEnumNew).toBe("male");
    });
});