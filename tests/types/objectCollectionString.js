describe("Testing array collection property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propStringCollectionObject');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);

        prop.getValue().add("item4", 'str4');
        expect(prop.isModified()).toBe(true);
        prop.getValue().remove("item4");
    });

    it ("value", function() {
        expect(classInst.getPropStringCollectionObject().length).toBe(3);
        expect(classInst.getPropStringCollectionObject().get('item1')).toBe('str1');
        expect(classInst.getPropStringCollectionObject().get('item2')).toBe('str2');
        expect(classInst.getPropStringCollectionObject().get('item3')).toBe('str3');

        var keys = classInst.getPropStringCollectionObject().keys();
        expect(keys.length).toBe(3);
        expect(keys).toContain('item1');
        expect(keys).toContain('item2');
        expect(keys).toContain('item3');

        var data = classInst.getPropStringCollectionObject().getData();
        expect(Object.keys(data).length).toBe(3);
        expect(data["item1"]).toBe('str1');
        expect(data["item2"]).toBe('str2');
        expect(data["item3"]).toBe('str3');
    });

    it ("ability to set new value", function() {
        classInst.setPropStringCollectionObject({
            "item1": "item1",
            "item2": "item2"
        });
        expect(classInst.getPropStringCollectionObject().length).toBe(2);
        expect(classInst.getPropStringCollectionObject().get("item1")).toBe('item1');
        expect(classInst.getPropStringCollectionObject().get("item2")).toBe('item2');

        expect(function() { classInst.setPropStringCollectionObject("60"); }).toThrow();
        expect(function() { classInst.setPropStringCollectionObject(true); }).toThrow();
    });

    it ("nullable", function() {
        classInst.setPropStringCollectionObject(null);
        expect(classInst.getPropStringCollectionObject() === null).toBe(true);

        classInst.setPropStringCollectionObject({});
        classInst.getPropStringCollectionObject().add("item1", 'item10');
        expect(classInst.getPropStringCollectionObject().length).toBe(1);
        expect(classInst.getPropStringCollectionObject().get('item1')).toBe('item10');

        classInst.setPropStringCollectionObject({
            "item1": 'item3',
            "item2": 'item4'
        });
        expect(classInst.getPropStringCollectionObject().length).toBe(2);
        expect(classInst.getPropStringCollectionObject().get("item1")).toBe('item3');
        expect(classInst.getPropStringCollectionObject().get("item2")).toBe('item4');
    });

    it ("manipulations with collection items", function() {
        var value = classInst.getPropStringCollectionObject();

        // removing all
        value.removeItems();
        expect(value.length).toBe(0);

        // add items
        value.addItems({
            "item1": 'item1',
            "item2": 'item2',
            "item3": 'item3'
        });
        expect(value.length).toBe(3);
        expect(value.get("item1")).toBe('item1');
        expect(value.get("item2")).toBe('item2');
        expect(value.get("item3")).toBe('item3');

        // add item
        value.add("item4", 'item4');
        expect(function() { value.add(true); }).toThrow();
        expect(value.length).toBe(4);
        expect(value.get("item4")).toBe('item4');

        // remove one item
        value.remove("item4");
        expect(value.length).toBe(3);
        expect(value.isset("item4")).toBe(false);
        expect(function() { value.get("item4"); }).toThrow();

        // set one item
        value.set("item1", 'item100');
        expect(value.get("item1")).toBe('item100');
        value.set("item1", 'item1');

        // set a few items
        value.setItems({
            "item1": 'item11',
            "item2": 'item22',
            "item3": 'item33',
            "item4": 'item44'
        });
        expect(value.length).toBe(4);
        expect(value.get("item1")).toBe('item11');
        expect(value.get("item2")).toBe('item22');
        expect(value.get("item3")).toBe('item33');
        expect(value.get("item4")).toBe('item44');

        // replace items
        value.replaceItems({
            "item1": 'item1',
            "item2": 'item2',
            "item3": 'item3'
        });
        expect(value.length).toBe(3);
        expect(value.get("item1")).toBe('item1');
        expect(value.get("item2")).toBe('item2');
        expect(value.get("item3")).toBe('item3');

        // each items
        value.forEach(function(value, key) {
            switch(key) {
                case "item1":
                    expect(value).toBe('item1');
                    break;
                case "item2":
                    expect(value).toBe('item2');
                    break;
                case "item3":
                    expect(value).toBe('item3');
                    break;
                default:
                    expect(true).toBe(false);
                    break;
            }
        });

        // indexOf method
        expect(value.indexOf('unexistent')).toBe(null);
        expect(value.indexOf('item1')).toBe("item1");
        expect(value.indexOf('item2')).toBe("item2");
        expect(value.indexOf(function(value, key) {
            return value == 'item2';
        })).toBe("item2");

        // filter method
        var filterResult = value.filter(function(value, key) {
            return value == 'item2' || key == "item3";
        });
        expect(Object.keys(filterResult).length).toBe(2);
        expect(filterResult["item2"]).toBe('item2');
        expect(filterResult["item3"]).toBe('item3');

        // find method
        var searchResult = value.find('item2');
        expect(Object.keys(searchResult).length).toBe(1);
        expect(searchResult.hasOwnProperty('item2')).toBe(true);

        // getting data
        var valueData = value.getData();
        expect(Object.keys(valueData).length).toBe(3);
        expect(valueData["item1"]).toBe('item1');
        expect(valueData["item2"]).toBe('item2');
        expect(valueData["item3"]).toBe('item3');

    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();

        classInst.setPropStringCollectionObject({
            "str1": 'str1',
            "str2": 'str2'
        });
        expect(classInst.getPropStringCollectionObject().length).toBe(3);
        expect(classInst.getPropStringCollectionObject().get("item1")).toBe('item1');
        expect(classInst.getPropStringCollectionObject().get("item2")).toBe('item2');
        expect(classInst.getPropStringCollectionObject().get("item3")).toBe('item3');

        prop.unlock();
        classInst.setPropStringCollectionObject({
            "str1": 'str1',
            "str2": 'str2'
        });
        expect(classInst.getPropStringCollectionObject().length).toBe(2);
        expect(classInst.getPropStringCollectionObject().get("str1")).toBe('str1');
        expect(classInst.getPropStringCollectionObject().get("str2")).toBe('str2');
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("default value", function() {
        expect(Object.keys(prop.getDefaultValue()).length).toBe(2);
        expect(prop.getDefaultValue().item1).toBe('foo');
        expect(prop.getDefaultValue().item2).toBe('bar');
    });

    it ("watchers", function() {
        expect(classInst.changedPropStringCollectionObject).toBe(true);

        expect(Object.keys(classInst.propStringCollectionObjectOld).length).toBe(3);
        expect(classInst.propStringCollectionObjectOld["item1"]).toBe('item1');
        expect(classInst.propStringCollectionObjectOld["item2"]).toBe('item2');
        expect(classInst.propStringCollectionObjectOld["item3"]).toBe('item3');

        expect(Object.keys(classInst.propStringCollectionObjectNew).length).toBe(2);
        expect(classInst.propStringCollectionObjectNew["str1"]).toBe('str1');
        expect(classInst.propStringCollectionObjectNew["str2"]).toBe('str2');
    });
});