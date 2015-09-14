describe("Testing array collection property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propMapCollectionObject');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("value", function() {
        var value = classInst.getPropMapCollectionObject();
        expect(value.length).toBe(3);

        expect(value.get("item1").propMapNumber).toBe(10);
        expect(value.get("item1").propMapString).toBe('string value');
        expect(value.get("item1").propMapMap.mapMapString).toBe('map string value');

        expect(value.get("item2").propMapNumber).toBe(100);
        expect(value.get("item2").propMapString).toBe('string value');
        expect(value.get("item2").propMapMap.mapMapString).toBe('map string value');

        expect(value.get("item3").propMapNumber).toBe(100);
        expect(value.get("item3").propMapString).toBe('string value');
        expect(value.get("item3").propMapMap.mapMapString).toBe('new map string value!!!');

        var data = classInst.getPropMapCollectionObject().getData();
        expect(Object.keys(data).length).toBe(3);

        expect(data["item1"].propMapNumber).toBe(10);
        expect(data["item1"].propMapString).toBe('string value');
        expect(data["item1"].propMapMap.mapMapString).toBe('map string value');

        expect(data["item2"].propMapNumber).toBe(100);
        expect(data["item2"].propMapString).toBe('string value');
        expect(data["item2"].propMapMap.mapMapString).toBe('map string value');

        expect(data["item3"].propMapNumber).toBe(100);
        expect(data["item3"].propMapString).toBe('string value');
        expect(data["item3"].propMapMap.mapMapString).toBe('new map string value!!!');
    });

    it ("ability to set new value", function() {
        classInst.setPropMapCollectionObject({
            "item1": {
                propMapNumber: 2000
            }
        });
        var value = classInst.getPropMapCollectionObject();
        expect(value.length).toBe(1);
        expect(value.get("item1").propMapNumber).toBe(2000);
        expect(value.get("item1").propMapString).toBe('');
        expect(value.get("item1").propMapMap.mapMapString).toBe('');

        value.replaceItems({
            "item1": {
                propMapNumber: 3000,
                propMapString: "new string value",
                propMapMap: {
                    mapMapString: "map new string value"
                }
            }
        });
        value = classInst.getPropMapCollectionObject();
        expect(value.length).toBe(1);
        expect(value.get("item1").propMapNumber).toBe(3000);
        expect(value.get("item1").propMapString).toBe('new string value');
        expect(value.get("item1").propMapMap.mapMapString).toBe('map new string value');

        expect(function() { classInst.setPropMapCollectionObject("60"); }).toThrow();
        expect(function() {
            classInst.setPropMapCollectionObject({
                propMapNumber: 5000,
                propMapString: "new string value 2",
                propMapMap: {
                    mapMapString: "map new string value 2"
                }
            });
        }).toThrow();
        expect(function() {
            classInst.setPropMapCollectionObject({
                "item1": {
                    propMapNumber: "10",
                    propMapString: "new string value 3",
                    propMapMap: {
                        mapMapString: "map new string value 3"
                    }
                }
            });
        }).toThrow();

        prop.resetValue();
        value = prop.getValue();

        expect(Object.keys(value).length).toBe(3);

        expect(value.get("item1").propMapNumber).toBe(1000);
        expect(value.get("item1").propMapString).toBe('string value 1000');
        expect(value.get("item1").propMapMap.mapMapString).toBe('map string value 1000');

        expect(value.get("item2").propMapNumber).toBe(2000);
        expect(value.get("item2").propMapString).toBe('string value 1000');
        expect(value.get("item2").propMapMap.mapMapString).toBe('map string value 2000');

        expect(value.get("item3").propMapNumber).toBe(2000);
        expect(value.get("item3").propMapString).toBe('string value 3000');
        expect(value.get("item3").propMapMap.mapMapString).toBe('map string value 2000');

        value.add("item4", {
            "extends": "item3",
            "propMapNumber": 50
        });

        expect(value.get("item4").propMapNumber).toBe(50);
        expect(value.get("item4").propMapString).toBe('string value 3000');
        expect(value.get("item4").propMapMap.mapMapString).toBe('map string value 2000');

        value.set("item5", {
            "extends": "item4",
            "propMapMap": {
                "mapMapString": "new string value!!!"
            }
        });

        expect(value.get("item5").propMapNumber).toBe(50);
        expect(value.get("item5").propMapString).toBe('string value 3000');
        expect(value.get("item5").propMapMap.mapMapString).toBe('new string value!!!');
    });

    it ("nullable", function() {
        classInst.setPropMapCollectionObject(null);
        expect(classInst.getPropMapCollectionObject()).toBe(null);

        classInst.setPropMapCollectionObject({});
        classInst.getPropMapCollectionObject().add("item1", {
            propMapNumber: 100,
            propMapString: "yo!!!",
            propMapMap: {
                mapMapString: null
            }
        });
        var value = classInst.getPropMapCollectionObject();
        expect(value.length).toBe(1);
        expect(value.get("item1").propMapNumber).toBe(100);
        expect(value.get("item1").propMapString).toBe('yo!!!');
        expect(value.get("item1").propMapMap.mapMapString).toBe(null);
    });

    it ("manipulations with collection items", function() {
        var value = classInst.getPropMapCollectionObject();

        // removing all
        value.removeItems();
        expect(value.length).toBe(0);

        // add items
        value.addItems({
            "item1": {propMapMap: {mapMapString: "item1"}},
            "item2": {propMapMap: {mapMapString: "item2"}},
            "item3": {propMapMap: {mapMapString: "item3"}}
        });
        expect(value.length).toBe(3);
        expect(value.get("item1").propMapMap.mapMapString).toBe('item1');
        expect(value.get("item2").propMapMap.mapMapString).toBe('item2');
        expect(value.get("item3").propMapMap.mapMapString).toBe('item3');

        // add item
        value.add("item4", { propMapMap: { mapMapString: 'item4' } });
        expect(function() { value.add(true); }).toThrow();
        expect(value.length).toBe(4);
        expect(value.get("item4").propMapMap.mapMapString).toBe('item4');

        // remove one item
        var removedItem = value.remove("item4");
        expect(Subclass.Tools.isPlainObject(removedItem)).toBe(true);
        expect(removedItem.propMapNumber).toBe(0);
        expect(removedItem.propMapString).toBe('');
        expect(removedItem.propMapMap.mapMapString).toBe('item4');
        expect(value.length).toBe(3);
        expect(value.isset("item4")).toBe(false);
        expect(function() { value.get("item4"); }).toThrow();

        // set one item
        value.set("item1", { propMapMap: { mapMapString: 'item100' }});
        expect(value.get("item1").propMapMap.mapMapString).toBe('item100');
        value.set("item1", { propMapMap: { mapMapString: 'item1' }});

        // set a few items
        value.setItems({
            "item1": { propMapMap: { mapMapString: "item11" } },
            "item2": { propMapMap: { mapMapString: "item22" } },
            "item3": { propMapMap: { mapMapString: "item33" } },
            "item4": { propMapMap: { mapMapString: "item44" } }
        });
        expect(value.length).toBe(4);
        expect(value.get("item1").propMapMap.mapMapString).toBe('item11');
        expect(value.get("item2").propMapMap.mapMapString).toBe('item22');
        expect(value.get("item3").propMapMap.mapMapString).toBe('item33');
        expect(value.get("item4").propMapMap.mapMapString).toBe('item44');

        // replace items
        value.replaceItems({
            "item1": { propMapMap: { mapMapString: "item1" } },
            "item2": { propMapMap: { mapMapString: "item2" } },
            "item3": { propMapMap: { mapMapString: "item3" } }
        });
        expect(value.length).toBe(3);
        expect(value.get("item1").propMapMap.mapMapString).toBe('item1');
        expect(value.get("item2").propMapMap.mapMapString).toBe('item2');
        expect(value.get("item3").propMapMap.mapMapString).toBe('item3');

        // each items
        value.forEach(function(value, key) {
            switch(key) {
                case "item1":
                    expect(value.propMapMap.mapMapString).toBe('item1');
                    break;
                case "item2":
                    expect(value.propMapMap.mapMapString).toBe('item2');
                    break;
                case "item3":
                    expect(value.propMapMap.mapMapString).toBe('item3');
                    break;
                default:
                    expect(true).toBe(false);
                    break;
            }
        });

        // indexOf method
        expect(value.indexOf('unexistent')).toBe(null);
        expect(value.indexOf(function(value, key) {
            return value.propMapMap.mapMapString == 'item1';
        })).toBe("item1");

        // filter method
        var filterResult = value.filter(function(value, key) {
            return value.propMapMap.mapMapString == 'item2' || key == "item3";
        });
        expect(Object.keys(filterResult).length).toBe(2);
        expect(Subclass.Tools.isPlainObject(filterResult)).toBe(true);
        expect(filterResult["item2"].propMapMap.mapMapString).toBe('item2');
        expect(filterResult["item3"].propMapMap.mapMapString).toBe('item3');
        filterResult["item2"].propMapNumber = 100;
        expect(function() { filterResult["item2"].propMapNumber = "100"; }).toThrow();


        // find method
        var searchResult = value.find({
            propMapNumber: 100
        });
        expect(Object.keys(searchResult).length).toBe(1);
        expect(searchResult.hasOwnProperty('item2')).toBe(true);

        searchResult = value.find({
            propMapNumber: 100,
            propMapString: "psix"
        });
        expect(Object.keys(searchResult).length).toBe(0);


        // getting data
        var propData = value.getData();
        expect(Object.keys(propData).length).toBe(3);
        expect(propData["item1"].propMapMap.mapMapString).toBe('item1');
        expect(propData["item2"].propMapMap.mapMapString).toBe('item2');
        expect(propData["item3"].propMapMap.mapMapString).toBe('item3');
    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();

        classInst.setPropMapCollectionObject({
            "str1": { propMapMap: { mapMapString: 'str1' } },
            "str2": { propMapMap: { mapMapString: 'str2' } }
        });
        var value = classInst.getPropMapCollectionObject();
        expect(value.length).toBe(3);
        expect(value.get("item1").propMapMap.mapMapString).toBe('item1');
        expect(value.get("item2").propMapMap.mapMapString).toBe('item2');
        expect(value.get("item3").propMapMap.mapMapString).toBe('item3');

        prop.unlock();
        classInst.setPropMapCollectionObject({
            "str1": { propMapMap: { mapMapString: 'str1' } },
            "str2": { propMapMap: { mapMapString: 'str2' } }
        });
        value = classInst.getPropMapCollectionObject();
        expect(value.length).toBe(2);
        expect(value.get("str1").propMapMap.mapMapString).toBe('str1');
        expect(value.get("str2").propMapMap.mapMapString).toBe('str2');
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("default value", function() {
        var defaultValue = prop.getDefaultValue();
        expect(Object.keys(defaultValue).length).toBe(3);

        expect(defaultValue["item1"].propMapNumber).toBe(1000);
        expect(defaultValue["item1"].propMapString).toBe('string value 1000');
        expect(defaultValue["item1"].propMapMap.mapMapString).toBe('map string value 1000');

        expect(defaultValue["item2"].propMapNumber).toBe(2000);
        expect(defaultValue["item2"].propMapString).toBe('string value 1000');
        expect(defaultValue["item2"].propMapMap.mapMapString).toBe('map string value 2000');

        expect(defaultValue["item3"].propMapNumber).toBe(2000);
        expect(defaultValue["item3"].propMapString).toBe('string value 3000');
        expect(defaultValue["item3"].propMapMap.mapMapString).toBe('map string value 2000');
    });

    it ("watchers", function() {
        expect(classInst.changedPropMapCollectionObject).toBe(true);

        expect(Object.keys(classInst.propMapCollectionObjectOld).length).toBe(3);
        expect(classInst.propMapCollectionObjectOld["item1"].propMapMap.mapMapString).toBe('item1');
        expect(classInst.propMapCollectionObjectOld["item2"].propMapMap.mapMapString).toBe('item2');
        expect(classInst.propMapCollectionObjectOld["item3"].propMapMap.mapMapString).toBe('item3');

        expect(Object.keys(classInst.propMapCollectionObjectNew).length).toBe(2);
        expect(classInst.propMapCollectionObjectNew["str1"].propMapMap.mapMapString).toBe('str1');
        expect(classInst.propMapCollectionObjectNew["str2"].propMapMap.mapMapString).toBe('str2');
    });
});