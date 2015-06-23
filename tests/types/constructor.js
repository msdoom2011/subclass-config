describe("Testing constructor property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propConstructor');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("default value", function() {
        expect(prop.getDefaultValue().getMilliseconds()).toBe(0);
    });

    it ("value", function() {
        expect(classInst.getPropConstructor().getMilliseconds()).toBe(100);
        expect(prop.getValue().getMilliseconds()).toBe(100);
    });

    it ("ability to set the new value", function() {
        classInst.setPropConstructor(new Date(200));
        expect(classInst.getPropConstructor().getMilliseconds()).toBe(200);
        expect(function() { classInst.setPropConstructor("false date"); }).toThrow();
        expect(function() { classInst.setPropConstructor(true); }).toThrow();
        expect(function() { classInst.setPropConstructor({}); }).toThrow();
        expect(function() { classInst.setPropConstructor([]); }).toThrow();
    });

    it ("nullable", function() {
        classInst.setPropConstructor(null);
        expect(classInst.getPropConstructor()).toBe(null);
        classInst.setPropConstructor(new Date(100));
        expect(classInst.getPropConstructor().getMilliseconds()).toBe(100);
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropConstructor(new Date(300));
        expect(classInst.getPropConstructor().getMilliseconds()).toBe(100);
        prop.unlock();
        classInst.setPropConstructor(new Date(300));
        expect(classInst.getPropConstructor().getMilliseconds()).toBe(300);
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropConstructor).toBe(true);
        expect(classInst.propConstructorOld.getMilliseconds()).toBe(100);
        expect(classInst.propConstructorNew.getMilliseconds()).toBe(300);
    });
});