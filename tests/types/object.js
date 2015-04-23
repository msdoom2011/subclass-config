describe("Testing object property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propObject');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("default value", function() {
        var value = prop.getDefaultValue();
        expect(Object.keys(value).length).toBe(2);
        expect(value.foo).toBe(10);
        expect(value.bar).toBe(20);
    });

    it ("value", function() {
        var value = classInst.getPropObject();
        expect(Object.keys(value).length).toBe(1);
        expect(value.prop1).toBe(30);
    });

    it ("ability to set the new value", function() {
        classInst.setPropObject({ prop: 100 });
        expect(Object.keys(classInst.getPropObject()).length).toBe(1);
        expect(classInst.getPropObject().prop).toBe(100);
        expect(function() { classInst.setPropObject([ 1, 2, 3]); }).toThrow();
        expect(function() { classInst.setPropObject(undefined); }).toThrow();
        expect(function() { classInst.setPropObject(true); }).toThrow();
    });

    it ("nullable", function() {
        classInst.setPropObject(null);
        expect(classInst.getPropObject()).toBe(null);
        classInst.setPropObject({ prop: 50 });
        expect(Object.keys(classInst.getPropObject()).length).toBe(1);
        expect(classInst.getPropObject().prop).toBe(50);
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();
        classInst.setPropObject({ prop: 60 });
        expect(Object.keys(classInst.getPropObject()).length).toBe(1);
        expect(classInst.getPropObject().prop).toBe(50);
        prop.unlock();
        classInst.setPropObject({ prop: 60 });
        expect(Object.keys(classInst.getPropObject()).length).toBe(1);
        expect(classInst.getPropObject().prop).toBe(60);
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("watchers", function() {
        expect(classInst.changedPropObject).toBe(true);
        expect(classInst.propObjectOld.prop).toBe(50);
        expect(classInst.propObjectNew.prop).toBe(60);
    });
});