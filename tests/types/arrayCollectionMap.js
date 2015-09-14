describe("Testing array collection property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propMapCollectionArray');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("value", function() {
        var value = classInst.getPropMapCollectionArray();
        expect(value.length).toBe(2);

        expect(value.get(0).propMapNumber).toBe(1000);
        expect(value.get(0).propMapString).toBe('string value 1000');
        expect(value.get(0).propMapMap.mapMapString).toBe('map string value 1000');

        expect(value.get(1).propMapNumber).toBe(1001);
        expect(value.get(1).propMapString).toBe('string value 1001');
        expect(value.get(1).propMapMap.mapMapString).toBe('map string value 1001');

        var data = classInst.getPropMapCollectionArray().getData();
        expect(data.length).toBe(2);

        expect(data[0].propMapNumber).toBe(1000);
        expect(data[0].propMapString).toBe('string value 1000');
        expect(data[0].propMapMap.mapMapString).toBe('map string value 1000');

        expect(data[1].propMapNumber).toBe(1001);
        expect(data[1].propMapString).toBe('string value 1001');
        expect(data[1].propMapMap.mapMapString).toBe('map string value 1001');
    });

    it ("ability to set new value", function() {
        classInst.setPropMapCollectionArray([
            {
                propMapNumber: 2000
            }
        ]);
        var value = classInst.getPropMapCollectionArray();
        expect(value.length).toBe(1);
        expect(value.get(0).propMapNumber).toBe(2000);
        expect(value.get(0).propMapString).toBe('');
        expect(value.get(0).propMapMap.mapMapString).toBe('');

        value.replaceItems([
            {
                propMapNumber: 3000,
                propMapString: "new string value",
                propMapMap: {
                    mapMapString: "map new string value"
                }
            }
        ]);
        value = classInst.getPropMapCollectionArray();
        expect(value.length).toBe(1);
        expect(value.get(0).propMapNumber).toBe(3000);
        expect(value.get(0).propMapString).toBe('new string value');
        expect(value.get(0).propMapMap.mapMapString).toBe('map new string value');

        expect(function() { classInst.setPropMapCollectionArray("60"); }).toThrow();
        expect(function() {
            classInst.setPropMapCollectionArray({
                propMapNumber: 5000,
                propMapString: "new string value 2",
                propMapMap: {
                    mapMapString: "map new string value 2"
                }
            });
        }).toThrow();
        expect(function() {
            classInst.setPropMapCollectionArray([
                {
                    propMapNumber: "10",
                    propMapString: "new string value 3",
                    propMapMap: {
                        mapMapString: "map new string value 3"
                    }
                }
            ]);
        }).toThrow();
    });

    it ("nullable", function() {
        classInst.setPropMapCollectionArray(null);
        expect(classInst.getPropMapCollectionArray()).toBe(null);

        classInst.setPropMapCollectionArray([]);
        classInst.getPropMapCollectionArray().add({
            propMapNumber: 100,
            propMapString: "yo!!!",
            propMapMap: {
                mapMapString: null
            }
        });
        var value = classInst.getPropMapCollectionArray();
        expect(value.length).toBe(1);
        expect(value.get(0).propMapNumber).toBe(100);
        expect(value.get(0).propMapString).toBe('yo!!!');
        expect(value.get(0).propMapMap.mapMapString).toBe(null);
    });

    it ("manipulations with collection items", function() {
        var prop = classInst.getPropMapCollectionArray();

        // removing all
        prop.removeItems();
        expect(prop.length).toBe(0);

        // add items
        prop.addItems([
            { propMapMap: { mapMapString: "item1" } },
            { propMapMap: { mapMapString: "item2" } },
            { propMapMap: { mapMapString: "item3" } }
        ]);
        expect(prop.length).toBe(3);
        expect(prop.get(0).propMapMap.mapMapString).toBe('item1');
        expect(prop.get(1).propMapMap.mapMapString).toBe('item2');
        expect(prop.get(2).propMapMap.mapMapString).toBe('item3');

        // add item
        prop.add({ propMapMap: { mapMapString: 'item4' } });
        expect(function() { prop.add(true); }).toThrow();
        expect(prop.length).toBe(4);
        expect(prop.get(3).propMapMap.mapMapString).toBe('item4');

        // push item
        prop.push({ propMapMap: { mapMapString: 'item5' } });
        expect(prop.length).toBe(5);
        expect(prop.get(4).propMapMap.mapMapString).toBe('item5');

        // pop item
        var removedItem = prop.pop();
        expect(Subclass.Tools.isPlainObject(removedItem)).toBe(true);
        expect(removedItem.propMapNumber).toBe(0);
        expect(removedItem.propMapString).toBe('');
        expect(removedItem.propMapMap.mapMapString).toBe('item5');
        expect(prop.length).toBe(4);

        // unshift item
        prop.unshift({ propMapMap: { mapMapString: 'item0' } });
        expect(prop.length).toBe(5);
        expect(prop.get(0).propMapMap.mapMapString).toBe('item0');
        expect(prop.get(1).propMapMap.mapMapString).toBe('item1');
        expect(prop.get(2).propMapMap.mapMapString).toBe('item2');
        expect(prop.get(3).propMapMap.mapMapString).toBe('item3');
        expect(prop.get(4).propMapMap.mapMapString).toBe('item4');

        // shift item
        removedItem = prop.shift();
        expect(Subclass.Tools.isPlainObject(removedItem)).toBe(true);
        expect(removedItem.propMapNumber).toBe(0);
        expect(removedItem.propMapString).toBe('');
        expect(removedItem.propMapMap.mapMapString).toBe('item0');
        expect(prop.length).toBe(4);

        // remove one item
        removedItem = prop.remove(3);
        expect(Subclass.Tools.isPlainObject(removedItem)).toBe(true);
        expect(removedItem.propMapNumber).toBe(0);
        expect(removedItem.propMapString).toBe('');
        expect(removedItem.propMapMap.mapMapString).toBe('item4');
        expect(prop.length).toBe(3);
        expect(prop.isset(3)).toBe(false);
        expect(function() { prop.get(3); }).toThrow();

        // set one item
        prop.set(0, { propMapMap: { mapMapString: 'item100' }});
        expect(prop.get(0).propMapMap.mapMapString).toBe('item100');
        prop.set(0, { propMapMap: { mapMapString: 'item1' }});
        prop.set(10, { propMapMap: { mapMapString: 'item10' } });
        expect(prop.length).toBe(11);
        expect(prop.get(4).propMapMap.mapMapString).toBe('');
        expect(prop.get(7).propMapMap.mapMapString).toBe('');

        // removing a few items
        prop.removeItems(7, 2);
        expect(prop.length).toBe(9);
        expect(prop.get(8).propMapMap.mapMapString).toBe('item10');
        prop.removeItems(3);
        expect(prop.length).toBe(3);
        expect(prop.get(prop.length - 1).propMapMap.mapMapString).toBe('item3');

        // set a few items
        prop.setItems([
            { propMapMap: { mapMapString: "item11" } },
            { propMapMap: { mapMapString: "item22" } },
            { propMapMap: { mapMapString: "item33" } },
            { propMapMap: { mapMapString: "item44" } }
        ]);
        expect(prop.length).toBe(4);
        expect(prop.get(0).propMapMap.mapMapString).toBe('item11');
        expect(prop.get(1).propMapMap.mapMapString).toBe('item22');
        expect(prop.get(2).propMapMap.mapMapString).toBe('item33');
        expect(prop.get(3).propMapMap.mapMapString).toBe('item44');

        // replace items
        prop.replaceItems([
            { propMapMap: { mapMapString: "item1" } },
            { propMapMap: { mapMapString: "item2" } },
            { propMapMap: { mapMapString: "item3" } }
        ]);
        expect(prop.length).toBe(3);
        expect(prop.get(0).propMapMap.mapMapString).toBe('item1');
        expect(prop.get(1).propMapMap.mapMapString).toBe('item2');
        expect(prop.get(2).propMapMap.mapMapString).toBe('item3');

        // each items
        prop.forEach(function(value, key) {
            switch(key) {
                case 0:
                    expect(value.propMapMap.mapMapString).toBe('item1');
                    break;
                case 1:
                    expect(value.propMapMap.mapMapString).toBe('item2');
                    break;
                case 2:
                    expect(value.propMapMap.mapMapString).toBe('item3');
                    break;
                default:
                    expect(true).toBe(false);
                    break;
            }
        });

        // indexOf method
        prop.unshift({ propMapMap: { mapMapString: 'item1' }});
        expect(prop.indexOf('unexistent')).toBe(-1);
        expect(prop.indexOf(function(value, key) {
            return value.propMapMap.mapMapString == 'item1';
        })).toBe(0);

        // lastIndexOf method
        expect(prop.lastIndexOf('unexistent')).toBe(-1);
        expect(prop.lastIndexOf(function(value, key) {
            return value.propMapMap.mapMapString == 'item1';
        })).toBe(1);
        prop.shift();

        // join method
        expect(prop.join()).toBe('[object Object],[object Object],[object Object]');
        expect(prop.join('. ')).toBe('[object Object]. [object Object]. [object Object]');

        // swap items method
        prop.swap(0, 2);
        expect(prop.get(0).propMapMap.mapMapString).toBe('item3');
        expect(prop.get(2).propMapMap.mapMapString).toBe('item1');
        prop.swap(0, 2);
        expect(prop.get(0).propMapMap.mapMapString).toBe('item1');
        expect(prop.get(2).propMapMap.mapMapString).toBe('item3');
        prop.swap(1, 2);
        expect(prop.get(1).propMapMap.mapMapString).toBe('item3');
        expect(prop.get(2).propMapMap.mapMapString).toBe('item2');
        prop.swap(1, 2);
        expect(prop.get(1).propMapMap.mapMapString).toBe('item2');
        expect(prop.get(2).propMapMap.mapMapString).toBe('item3');

        // reverse items order
        prop.reverse();
        expect(prop.get(0).propMapMap.mapMapString).toBe('item3');
        expect(prop.get(1).propMapMap.mapMapString).toBe('item2');
        expect(prop.get(2).propMapMap.mapMapString).toBe('item1');
        prop.reverse();
        expect(prop.get(0).propMapMap.mapMapString).toBe('item1');
        expect(prop.get(1).propMapMap.mapMapString).toBe('item2');
        expect(prop.get(2).propMapMap.mapMapString).toBe('item3');

        // sort items
        prop.sort(function(a, b) {
            a = a.propMapMap.mapMapString;
            b = b.propMapMap.mapMapString;

            if (a > b) {
                return -1;
            } else if (a < b) {
                return 1;
            }
            return 0;
        });
        expect(prop.get(0).propMapMap.mapMapString).toBe('item3');
        expect(prop.get(1).propMapMap.mapMapString).toBe('item2');
        expect(prop.get(2).propMapMap.mapMapString).toBe('item1');
        prop.reverse();

        // slice method
        var slicedArr = prop.slice(1, 2);
        expect(slicedArr.length).toBe(1);
        expect(Array.isArray(slicedArr)).toBe(true);
        expect(slicedArr[0].propMapMap.mapMapString).toBe('item2');
        slicedArr[0].propMapNumber = 100;
        expect(function() { slicedArr[0].propMapNumber = "100"; }).toThrow();

        // filter method
        var filterResult = prop.filter(function(value, key) {
            return value.propMapMap.mapMapString == 'item2' || key == 2;
        });
        expect(filterResult.length).toBe(2);
        expect(Array.isArray(filterResult)).toBe(true);
        expect(filterResult[0].propMapMap.mapMapString).toBe('item2');
        filterResult[0].propMapNumber = 100;
        expect(function() { filterResult[0].propMapNumber = "100"; }).toThrow();


        // find method

        var searchResult = prop.find({
            propMapNumber: 100
        });
        expect(searchResult.length).toBe(1);
        expect(searchResult[0].propMapNumber).toBe(100);

        searchResult = prop.find({
            propMapNumber: 100,
            propMapString: "psix"
        });
        expect(searchResult.length).toBe(0);


        // getting data
        var propData = prop.getData();
        expect(propData.length).toBe(3);
        expect(propData[0].propMapMap.mapMapString).toBe('item1');
        expect(propData[1].propMapMap.mapMapString).toBe('item2');
        expect(propData[2].propMapMap.mapMapString).toBe('item3');

    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();

        classInst.setPropMapCollectionArray([
            { propMapMap: { mapMapString: 'str1' } },
            { propMapMap: { mapMapString: 'str2' } }
        ]);
        var value = classInst.getPropMapCollectionArray();
        expect(value.length).toBe(3);
        expect(value.get(0).propMapMap.mapMapString).toBe('item1');
        expect(value.get(1).propMapMap.mapMapString).toBe('item2');
        expect(value.get(2).propMapMap.mapMapString).toBe('item3');

        prop.unlock();
        classInst.setPropMapCollectionArray([
            { propMapMap: { mapMapString: 'str1' } },
            { propMapMap: { mapMapString: 'str2' } }
        ]);
        value = classInst.getPropMapCollectionArray();
        expect(value.length).toBe(2);
        expect(value.get(0).propMapMap.mapMapString).toBe('str1');
        expect(value.get(1).propMapMap.mapMapString).toBe('str2');
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("default value", function() {
        var defaultValue = prop.getDefaultValue();
        expect(defaultValue.length).toBe(2);

        expect(defaultValue[0].propMapNumber).toBe(10);
        expect(defaultValue[0].propMapString).toBe('string value');
        expect(defaultValue[0].propMapMap.mapMapString).toBe('map string value');

        expect(defaultValue[1].propMapNumber).toBe(20);
        expect(defaultValue[1].propMapString).toBe('string value 2');
        expect(defaultValue[1].propMapMap.mapMapString).toBe('map string value 2');
    });

    it ("watchers", function() {
        expect(classInst.changedPropMapCollectionArray).toBe(true);

        expect(classInst.propMapCollectionArrayOld.length).toBe(3);
        expect(classInst.propMapCollectionArrayOld[0].propMapMap.mapMapString).toBe('item1');
        expect(classInst.propMapCollectionArrayOld[1].propMapMap.mapMapString).toBe('item2');
        expect(classInst.propMapCollectionArrayOld[2].propMapMap.mapMapString).toBe('item3');

        expect(classInst.propMapCollectionArrayNew.length).toBe(2);
        expect(classInst.propMapCollectionArrayNew[0].propMapMap.mapMapString).toBe('str1');
        expect(classInst.propMapCollectionArrayNew[1].propMapMap.mapMapString).toBe('str2');
    });
});