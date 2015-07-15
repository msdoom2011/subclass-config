describe("Testing array collection property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propArrayCollectionCollectionObject');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("value", function() {
        var value = classInst.getPropArrayCollectionCollectionObject();
        expect(value.length).toBe(2);

        expect(value.get("item1").length).toBe(3);
        expect(value.get("item1").get(0)).toBe('item11');
        expect(value.get("item1").get(1)).toBe('item12');
        expect(value.get("item1").get(2)).toBe('item13');

        expect(value.get("item2").length).toBe(3);
        expect(value.get("item2").get(0)).toBe('item21');
        expect(value.get("item2").get(1)).toBe('item22');
        expect(value.get("item2").get(2)).toBe('item23');

        var data = classInst.getPropArrayCollectionCollectionObject().getData();
        expect(Object.keys(data).length).toBe(2);

        expect(data["item1"].length).toBe(3);
        expect(data["item1"][0]).toBe('item11');
        expect(data["item1"][1]).toBe('item12');
        expect(data["item1"][2]).toBe('item13');

        expect(data["item2"].length).toBe(3);
        expect(data["item2"][0]).toBe('item21');
        expect(data["item2"][1]).toBe('item22');
        expect(data["item2"][2]).toBe('item23');
    });

    it ("ability to set new value", function() {
        prop.setValue({});
        var value = prop.getValue();
        expect(value.length).toBe(0);

        classInst.setPropArrayCollectionCollectionObject({
            "item1": ['s1'],
            "item2": ['s2']
        });
        value = classInst.getPropArrayCollectionCollectionObject();
        expect(value.length).toBe(2);

        expect(value.get("item1").length).toBe(1);
        expect(value.get("item1").get(0)).toBe('s1');

        expect(value.get("item2").length).toBe(1);
        expect(value.get("item2").get(0)).toBe('s2');

        value.replaceItems({
            "item1": ['s3'],
            "item2": ['s4'],
            "item3": ['s5']
        });
        value = classInst.getPropArrayCollectionCollectionObject();
        expect(value.length).toBe(3);

        expect(value.get("item1").length).toBe(1);
        expect(value.get("item1").get(0)).toBe('s3');

        expect(value.get("item2").length).toBe(1);
        expect(value.get("item2").get(0)).toBe('s4');

        expect(value.get("item3").length).toBe(1);
        expect(value.get("item3").get(0)).toBe('s5');

        expect(function() { classInst.setPropArrayCollectionCollectionObject("60"); }).toThrow();

        expect(function() {
            classInst.setPropArrayCollectionCollectionObject({
                "item1": 'str1',
                "item2": 'str2',
                "item3": 'str3'
            });
        }).toThrow();

        expect(function() {
            classInst.setPropArrayCollectionCollectionArray({
                "item1": [11, 12, 13],
                "item2": [21, 22, 23]
            });
        }).toThrow();
    });

    it ("nullable", function() {
        prop.setValue(null);
        expect(prop.getValue()).toBe(null);

        prop.setValue({});
        var value = prop.getValue();

        value.add("item1", []);
        value.get("item1").add('item11');
        value.get("item1").add('item12');
        value.get("item1").add('item13');

        value.add("item2", []);
        value.get("item2").add('item21');
        value.get("item2").add('item22');
        value.get("item2").add('item23');

        expect(value.get("item1").length).toBe(3);
        expect(value.get("item1").get(0)).toBe('item11');
        expect(value.get("item1").get(1)).toBe('item12');
        expect(value.get("item1").get(2)).toBe('item13');

        expect(value.get("item2").length).toBe(3);
        expect(value.get("item2").get(0)).toBe('item21');
        expect(value.get("item2").get(1)).toBe('item22');
        expect(value.get("item2").get(2)).toBe('item23');
    });

    it ("manipulations with collection items", function() {
        var value = classInst.getPropArrayCollectionCollectionObject();



        // removing all

        value.removeItems();
        expect(value.length).toBe(0);



        // add items

        value.addItems({
            "item1": ['item11' , 'item12', 'item13'],
            "item2": ['item21', 'item22', 'item23']
        });
        expect(value.get("item1").length).toBe(3);
        expect(value.get("item1").get(0)).toBe('item11');
        expect(value.get("item1").get(1)).toBe('item12');
        expect(value.get("item1").get(2)).toBe('item13');

        expect(value.get("item2").length).toBe(3);
        expect(value.get("item2").get(0)).toBe('item21');
        expect(value.get("item2").get(1)).toBe('item22');
        expect(value.get("item2").get(2)).toBe('item23');



        // add item

        value.add("item3", [ 'item31', 'item32', 'item33']);
        var i = 0;

        value.forEach(function(itemValue, itemKey) {
            itemValue.add('item' + (i + 1) + (itemValue.length + 1));
            i++;
        });
        expect(function() { value.add(true); }).toThrow();
        expect(value.length).toBe(3);
        value.forEach(function(itemValue, itemKey) {
            expect(/4$/.test(itemValue.get(3))).toBe(true);
        });



        // remove one item

        var removedItem = value.remove("item2");

        expect(removedItem.length).toBe(4);
        expect(removedItem[0]).toBe('item21');
        expect(removedItem[1]).toBe('item22');
        expect(removedItem[2]).toBe('item23');
        expect(removedItem[3]).toBe('item24');

        expect(value.length).toBe(2);
        expect(value.isset("item2")).toBe(false);
        expect(function() { value.get(2); }).toThrow();

        expect(value.get("item1").length).toBe(4);
        expect(value.get("item1").get(0)).toBe('item11');
        expect(value.get("item1").get(1)).toBe('item12');
        expect(value.get("item1").get(2)).toBe('item13');
        expect(value.get("item1").get(3)).toBe('item14');

        expect(value.get("item3").length).toBe(4);
        expect(value.get("item3").get(0)).toBe('item31');
        expect(value.get("item3").get(1)).toBe('item32');
        expect(value.get("item3").get(2)).toBe('item33');
        expect(value.get("item3").get(3)).toBe('item34');



        // set one item

        value.set("item2", [ 'item21', 'item22', 'item23', 'item24' ]);

        expect(value.get("item2").length).toBe(4);
        expect(value.get("item2").get(0)).toBe('item21');
        expect(value.get("item2").get(1)).toBe('item22');
        expect(value.get("item2").get(2)).toBe('item23');
        expect(value.get("item2").get(3)).toBe('item24');



        // set a few items

        value.setItems({
            "item1": ["item1"],
            "item2": ["item2"],
            "item3": ["item3"],
            "item4": ["item4"]
        });
        expect(value.length).toBe(4);
        expect(value.get("item1").get(0)).toBe('item1');
        expect(value.get("item2").get(0)).toBe('item2');
        expect(value.get("item3").get(0)).toBe('item3');
        expect(value.get("item4").get(0)).toBe('item4');



        // replace items

        value.replaceItems({
            "item1": ['item11', 'item12', 'item13'],
            "item2": ['item21', 'item22', 'item23']
        });
        expect(value.length).toBe(2);

        expect(value.get("item1").length).toBe(3);
        expect(value.get("item1").get(0)).toBe('item11');
        expect(value.get("item1").get(1)).toBe('item12');
        expect(value.get("item1").get(2)).toBe('item13');

        expect(value.get("item2").length).toBe(3);
        expect(value.get("item2").get(0)).toBe('item21');
        expect(value.get("item2").get(1)).toBe('item22');
        expect(value.get("item2").get(2)).toBe('item23');


        // indexOf method
        expect(value.indexOf('unexistent')).toBe(null);
        expect(value.get("item1").indexOf('item12')).toBe(1);
        expect(value.indexOf(function(value, key) {
            return value.get(2) == 'item13';
        })).toBe("item1");



        // filter method

        var filterResult = value.filter(function(itemValue, itemKey) {
            return itemValue.get(0) == 'item21' || itemKey == "item1";
        });
        expect(Subclass.Tools.isPlainObject(filterResult)).toBe(true);
        expect(Object.keys(filterResult).length).toBe(2);
        expect(filterResult["item2"].get(0)).toBe('item21');
        expect(filterResult["item1"].get(0)).toBe('item11');
        filterResult["item1"].set(0, "new value");
        expect(filterResult["item1"].get(0)).toBe('new value');
        expect(function() { filterResult["item1"].set(0, 11111); }).toThrow();
        filterResult["item1"].set(0, "item11");




        // getting data

        var data = value.getData();

        expect(data["item1"].length).toBe(3);
        expect(data["item1"][0]).toBe('item11');
        expect(data["item1"][1]).toBe('item12');
        expect(data["item1"][2]).toBe('item13');

        expect(data["item2"].length).toBe(3);
        expect(data["item2"][0]).toBe('item21');
        expect(data["item2"][1]).toBe('item22');
        expect(data["item2"][2]).toBe('item23');

    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();

        classInst.setPropArrayCollectionCollectionObject({
            "str1": [ 'str1' ],
            "str2": [ 'str2' ]
        });
        var value = classInst.getPropArrayCollectionCollectionObject();

        expect(value.get("item1").length).toBe(3);
        expect(value.get("item1").get(0)).toBe('item11');
        expect(value.get("item1").get(1)).toBe('item12');
        expect(value.get("item1").get(2)).toBe('item13');

        expect(value.get("item2").length).toBe(3);
        expect(value.get("item2").get(0)).toBe('item21');
        expect(value.get("item2").get(1)).toBe('item22');
        expect(value.get("item2").get(2)).toBe('item23');

        prop.unlock();
        classInst.setPropArrayCollectionCollectionObject({
            "str1": [ 'str1' ],
            "str2": [ 'str2' ]
        });
        value = classInst.getPropArrayCollectionCollectionObject();
        expect(value.length).toBe(2);
        expect(value.get("str1").get(0)).toBe('str1');
        expect(value.get("str2").get(0)).toBe('str2');
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("default value", function() {
        var data = prop.getDefaultValue();
        expect(Object.keys(data).length).toBe(2);

        expect(data["item1"][0]).toBe('str11');
        expect(data["item1"][1]).toBe('str12');
        expect(data["item1"][2]).toBe('str13');

        expect(data["item2"][0]).toBe('str21');
        expect(data["item2"][1]).toBe('str22');
        expect(data["item2"][2]).toBe('str23');
    });

    it ("watchers", function() {
        expect(classInst.changedPropArrayCollectionCollectionObject).toBe(true);

        expect(Object.keys(classInst.propArrayCollectionCollectionObjectOld).length).toBe(2);
        expect(classInst.propArrayCollectionCollectionObjectOld["item1"].length).toBe(3);
        expect(classInst.propArrayCollectionCollectionObjectOld["item1"][0]).toBe('item11');
        expect(classInst.propArrayCollectionCollectionObjectOld["item1"][1]).toBe('item12');
        expect(classInst.propArrayCollectionCollectionObjectOld["item1"][2]).toBe('item13');

        expect(classInst.propArrayCollectionCollectionObjectOld["item2"].length).toBe(3);
        expect(classInst.propArrayCollectionCollectionObjectOld["item2"][0]).toBe('item21');
        expect(classInst.propArrayCollectionCollectionObjectOld["item2"][1]).toBe('item22');
        expect(classInst.propArrayCollectionCollectionObjectOld["item2"][2]).toBe('item23');

        expect(Object.keys(classInst.propArrayCollectionCollectionObjectNew).length).toBe(2);
        expect(classInst.propArrayCollectionCollectionObjectNew["str1"][0]).toBe('str1');
        expect(classInst.propArrayCollectionCollectionObjectNew["str2"][0]).toBe('str2');
    });
});

