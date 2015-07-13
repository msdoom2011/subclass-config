describe("Testing array collection property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propArrayCollectionCollectionArray');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("value", function() {
        var value = classInst.getPropArrayCollectionCollectionArray();
        expect(value.length).toBe(2);

        expect(value.get(0).length).toBe(3);
        expect(value.get(0).get(0)).toBe('item11');
        expect(value.get(0).get(1)).toBe('item12');
        expect(value.get(0).get(2)).toBe('item13');

        expect(value.get(1).length).toBe(3);
        expect(value.get(1).get(0)).toBe('item21');
        expect(value.get(1).get(1)).toBe('item22');
        expect(value.get(1).get(2)).toBe('item23');

        var data = classInst.getPropArrayCollectionCollectionArray().getData();
        expect(data.length).toBe(2);

        expect(data[0].length).toBe(3);
        expect(data[0][0]).toBe('item11');
        expect(data[0][1]).toBe('item12');
        expect(data[0][2]).toBe('item13');

        expect(data[1].length).toBe(3);
        expect(data[1][0]).toBe('item21');
        expect(data[1][1]).toBe('item22');
        expect(data[1][2]).toBe('item23');
    });

    it ("ability to set new value", function() {
        prop.setValue([]);
        var value = prop.getValue();
        expect(value.length).toBe(0);

        classInst.setPropArrayCollectionCollectionArray([
            ['s1'],
            ['s2']
        ]);
        value = classInst.getPropArrayCollectionCollectionArray();
        expect(value.length).toBe(2);

        expect(value.get(0).length).toBe(1);
        expect(value.get(0).get(0)).toBe('s1');

        expect(value.get(1).length).toBe(1);
        expect(value.get(1).get(0)).toBe('s2');

        value.replaceItems([
            ['s3'],
            ['s4'],
            ['s5']
        ]);
        value = classInst.getPropArrayCollectionCollectionArray();
        expect(value.length).toBe(3);

        expect(value.get(0).length).toBe(1);
        expect(value.get(0).get(0)).toBe('s3');

        expect(value.get(1).length).toBe(1);
        expect(value.get(1).get(0)).toBe('s4');

        expect(value.get(2).length).toBe(1);
        expect(value.get(2).get(0)).toBe('s5');

        expect(function() { classInst.setPropArrayCollectionCollectionArray("60"); }).toThrow();

        expect(function() {
            classInst.setPropArrayCollectionCollectionArray(['str1', 'str2', 'str3']);
        }).toThrow();

        expect(function() {
            classInst.setPropArrayCollectionCollectionArray([
                [11, 12, 13],
                [21, 22, 23]
            ]);
        }).toThrow();
    });

    it ("nullable", function() {
        prop.setValue(null);
        expect(prop.getValue()).toBe(null);

        prop.setValue([]);
        var value = prop.getValue();

        value.add([]);
        value.get(0).add('item11');
        value.get(0).add('item12');
        value.get(0).add('item13');

        value.add([]);
        value.get(1).add('item21');
        value.get(1).add('item22');
        value.get(1).add('item23');

        expect(value.get(0).length).toBe(3);
        expect(value.get(0).get(0)).toBe('item11');
        expect(value.get(0).get(1)).toBe('item12');
        expect(value.get(0).get(2)).toBe('item13');

        expect(value.get(1).length).toBe(3);
        expect(value.get(1).get(0)).toBe('item21');
        expect(value.get(1).get(1)).toBe('item22');
        expect(value.get(1).get(2)).toBe('item23');
    });

    it ("manipulations with collection items", function() {
        var value = classInst.getPropArrayCollectionCollectionArray();



        // removing all

        value.removeItems();
        expect(value.length).toBe(0);



        // add items

        value.addItems([
            [ 'item11' , 'item12', 'item13'],
            [ 'item21' , 'item22', 'item23']
        ]);
        expect(value.get(0).length).toBe(3);
        expect(value.get(0).get(0)).toBe('item11');
        expect(value.get(0).get(1)).toBe('item12');
        expect(value.get(0).get(2)).toBe('item13');

        expect(value.get(1).length).toBe(3);
        expect(value.get(1).get(0)).toBe('item21');
        expect(value.get(1).get(1)).toBe('item22');
        expect(value.get(1).get(2)).toBe('item23');



        // add item

        value.add([ 'item31', 'item32', 'item33']);
        value.forEach(function(itemValue, itemIndex) {
            itemValue.add('item' + (itemIndex + 1) + (itemValue.length + 1));
        });
        expect(function() { value.add(true); }).toThrow();
        expect(value.length).toBe(3);
        value.forEach(function(itemValue, itemIndex) {
            expect(/4$/.test(itemValue.get(3))).toBe(true);
        });



        // push item

        value.push([ 'item41' ]);
        expect(value.length).toBe(4);
        expect(value.get(3).get(0)).toBe('item41');



        // pop item

        var removedItem = value.pop();
        expect(Array.isArray(removedItem)).toBe(true);
        expect(removedItem.length).toBe(1);
        expect(removedItem[0]).toBe('item41');
        expect(value.length).toBe(3);



        // unshift item

        value.forEach(function(itemValue, itemIndex) {
            itemValue.unshift('item' + (itemIndex + 1) + '0');
        });
        expect(value.length).toBe(3);

        expect(value.get(0).length).toBe(5);
        expect(value.get(0).get(0)).toBe('item10');
        expect(value.get(0).get(1)).toBe('item11');
        expect(value.get(0).get(2)).toBe('item12');
        expect(value.get(0).get(3)).toBe('item13');
        expect(value.get(0).get(4)).toBe('item14');

        expect(value.get(1).length).toBe(5);
        expect(value.get(1).get(0)).toBe('item20');
        expect(value.get(1).get(1)).toBe('item21');
        expect(value.get(1).get(2)).toBe('item22');
        expect(value.get(1).get(3)).toBe('item23');
        expect(value.get(1).get(4)).toBe('item24');

        expect(value.get(2).length).toBe(5);
        expect(value.get(2).get(0)).toBe('item30');
        expect(value.get(2).get(1)).toBe('item31');
        expect(value.get(2).get(2)).toBe('item32');
        expect(value.get(2).get(3)).toBe('item33');
        expect(value.get(2).get(4)).toBe('item34');



        // shift item

        value.forEach(function(itemValue, itemIndex) {
            var removed = itemValue.shift();
            expect(/0$/.test(removed)).toBe(true);
        });
        removedItem = value.shift();
        expect(value.length).toBe(2);

        expect(removedItem.length).toBe(4);
        expect(removedItem[0]).toBe('item11');
        expect(removedItem[1]).toBe('item12');
        expect(removedItem[2]).toBe('item13');
        expect(removedItem[3]).toBe('item14');

        expect(value.get(0).length).toBe(4);
        expect(value.get(0).get(0)).toBe('item21');
        expect(value.get(0).get(1)).toBe('item22');
        expect(value.get(0).get(2)).toBe('item23');
        expect(value.get(0).get(3)).toBe('item24');

        expect(value.get(1).length).toBe(4);
        expect(value.get(1).get(0)).toBe('item31');
        expect(value.get(1).get(1)).toBe('item32');
        expect(value.get(1).get(2)).toBe('item33');
        expect(value.get(1).get(3)).toBe('item34');



        // remove one item

        value.unshift(['item11', 'item12', 'item13', 'item14']);
        removedItem = value.remove(1);

        expect(Array.isArray(removedItem)).toBe(true);
        expect(removedItem.length).toBe(4);
        expect(removedItem[0]).toBe('item21');
        expect(removedItem[1]).toBe('item22');
        expect(removedItem[2]).toBe('item23');
        expect(removedItem[3]).toBe('item24');

        expect(value.length).toBe(2);
        expect(value.isset(2)).toBe(false);
        expect(function() { prop.get(2); }).toThrow();

        expect(value.get(0).length).toBe(4);
        expect(value.get(0).get(0)).toBe('item11');
        expect(value.get(0).get(1)).toBe('item12');
        expect(value.get(0).get(2)).toBe('item13');
        expect(value.get(0).get(3)).toBe('item14');

        expect(value.get(1).length).toBe(4);
        expect(value.get(1).get(0)).toBe('item31');
        expect(value.get(1).get(1)).toBe('item32');
        expect(value.get(1).get(2)).toBe('item33');
        expect(value.get(1).get(3)).toBe('item34');



        // set one item

        value.set(1, [ 'item21', 'item22', 'item23', 'item24' ]);

        expect(value.get(1).length).toBe(4);
        expect(value.get(1).get(0)).toBe('item21');
        expect(value.get(1).get(1)).toBe('item22');
        expect(value.get(1).get(2)).toBe('item23');
        expect(value.get(1).get(3)).toBe('item24');

        value.set(10, [ 'item10' ]);
        expect(value.length).toBe(11);
        expect(value.get(4).length).toBe(0);
        expect(value.get(7).length).toBe(0);



        // removing a few items

        value.removeItems(7, 2);
        expect(value.length).toBe(9);
        expect(value.get(8).get(0)).toBe('item10');
        value.removeItems(2);
        expect(value.length).toBe(2);
        expect(value.get(value.length - 1).get(0)).toBe('item21');



        // set a few items

        value.setItems([
            [ "item1" ],
            [ "item2" ],
            [ "item3" ],
            [ "item4" ]
        ]);
        expect(value.length).toBe(4);
        expect(value.get(0).get(0)).toBe('item1');
        expect(value.get(1).get(0)).toBe('item2');
        expect(value.get(2).get(0)).toBe('item3');
        expect(value.get(3).get(0)).toBe('item4');



        // replace items

        value.replaceItems([
            [ 'item11', 'item12', 'item13' ],
            [ 'item21', 'item22', 'item23' ]
        ]);
        expect(value.length).toBe(2);

        expect(value.get(0).length).toBe(3);
        expect(value.get(0).get(0)).toBe('item11');
        expect(value.get(0).get(1)).toBe('item12');
        expect(value.get(0).get(2)).toBe('item13');

        expect(value.get(1).length).toBe(3);
        expect(value.get(1).get(0)).toBe('item21');
        expect(value.get(1).get(1)).toBe('item22');
        expect(value.get(1).get(2)).toBe('item23');


        // indexOf method
        expect(value.indexOf('unexistent')).toBe(-1);
        expect(value.get(0).indexOf('item12')).toBe(1);
        expect(value.get(0).indexOf(function(value, key) {
            return value == 'item13';
        })).toBe(2);



        // lastIndexOf method

        value.get(0).add('item12');
        expect(value.get(0).lastIndexOf('unexistent')).toBe(-1);
        expect(value.get(0).lastIndexOf(function(value, key) {
            return value == 'item12';
        })).toBe(3);
        value.get(0).pop();



        // join method

        expect(value.join()).toBe('item11,item12,item13,item21,item22,item23');
        expect(value.join('. ')).toBe('item11,item12,item13. item21,item22,item23');



        // swap items method
        value.add(['item31', 'item32', 'item33']);

        value.swap(0, 2);
        expect(value.get(0).get(0)).toBe('item31');
        expect(value.get(2).get(0)).toBe('item11');
        value.swap(0, 2);
        expect(value.get(0).get(0)).toBe('item11');
        expect(value.get(2).get(0)).toBe('item31');
        value.swap(1, 2);
        expect(value.get(1).get(0)).toBe('item31');
        expect(value.get(2).get(0)).toBe('item21');
        value.swap(1, 2);
        expect(value.get(1).get(0)).toBe('item21');
        expect(value.get(2).get(0)).toBe('item31');



        // reverse items order

        value.reverse();

        expect(value.get(0).length).toBe(3);
        expect(value.get(0).get(0)).toBe('item31');
        expect(value.get(0).get(1)).toBe('item32');
        expect(value.get(0).get(2)).toBe('item33');

        expect(value.get(1).length).toBe(3);
        expect(value.get(1).get(0)).toBe('item21');
        expect(value.get(1).get(1)).toBe('item22');
        expect(value.get(1).get(2)).toBe('item23');

        expect(value.get(2).length).toBe(3);
        expect(value.get(2).get(0)).toBe('item11');
        expect(value.get(2).get(1)).toBe('item12');
        expect(value.get(2).get(2)).toBe('item13');

        value.reverse();

        expect(value.get(0).length).toBe(3);
        expect(value.get(0).get(0)).toBe('item11');
        expect(value.get(0).get(1)).toBe('item12');
        expect(value.get(0).get(2)).toBe('item13');

        expect(value.get(1).length).toBe(3);
        expect(value.get(1).get(0)).toBe('item21');
        expect(value.get(1).get(1)).toBe('item22');
        expect(value.get(1).get(2)).toBe('item23');

        expect(value.get(2).length).toBe(3);
        expect(value.get(2).get(0)).toBe('item31');
        expect(value.get(2).get(1)).toBe('item32');
        expect(value.get(2).get(2)).toBe('item33');



        // sort items

        value.sort(function(a, b) {
            a = a.get(0);
            b = b.get(0);

            if (a > b) {
                return -1;
            } else if (a < b) {
                return 1;
            }
            return 0;
        });
        expect(value.get(0).length).toBe(3);
        expect(value.get(0).get(0)).toBe('item31');
        expect(value.get(0).get(1)).toBe('item32');
        expect(value.get(0).get(2)).toBe('item33');

        expect(value.get(1).length).toBe(3);
        expect(value.get(1).get(0)).toBe('item21');
        expect(value.get(1).get(1)).toBe('item22');
        expect(value.get(1).get(2)).toBe('item23');

        expect(value.get(2).length).toBe(3);
        expect(value.get(2).get(0)).toBe('item11');
        expect(value.get(2).get(1)).toBe('item12');
        expect(value.get(2).get(2)).toBe('item13');

        value.reverse();



        // slice method

        var slicedArr = value.slice(1, 2);
        expect(slicedArr.length).toBe(1);
        expect(Array.isArray(slicedArr)).toBe(true);
        expect(slicedArr[0].get(0)).toBe('item21');



        // filter method

        var filterResult = value.filter(function(itemValue, itemIndex) {
            return itemValue.get(0) == 'item21' || itemIndex == 2;
        });
        expect(filterResult.length).toBe(2);
        expect(Array.isArray(filterResult)).toBe(true);
        expect(filterResult[0].get(0)).toBe('item21');
        expect(filterResult[1].get(0)).toBe('item31');



        // getting data

        var data = value.getData();

        expect(data[0].length).toBe(3);
        expect(data[0][0]).toBe('item11');
        expect(data[0][1]).toBe('item12');
        expect(data[0][2]).toBe('item13');

        expect(data[1].length).toBe(3);
        expect(data[1][0]).toBe('item21');
        expect(data[1][1]).toBe('item22');
        expect(data[1][2]).toBe('item23');

        expect(data[2].length).toBe(3);
        expect(data[2][0]).toBe('item31');
        expect(data[2][1]).toBe('item32');
        expect(data[2][2]).toBe('item33');

    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();

        classInst.setPropArrayCollectionCollectionArray([
            [ 'str1' ],
            [ 'str2' ]
        ]);
        var value = classInst.getPropArrayCollectionCollectionArray();

        expect(value.get(0).length).toBe(3);
        expect(value.get(0).get(0)).toBe('item11');
        expect(value.get(0).get(1)).toBe('item12');
        expect(value.get(0).get(2)).toBe('item13');

        expect(value.get(1).length).toBe(3);
        expect(value.get(1).get(0)).toBe('item21');
        expect(value.get(1).get(1)).toBe('item22');
        expect(value.get(1).get(2)).toBe('item23');

        expect(value.get(2).length).toBe(3);
        expect(value.get(2).get(0)).toBe('item31');
        expect(value.get(2).get(1)).toBe('item32');
        expect(value.get(2).get(2)).toBe('item33');

        prop.unlock();
        classInst.setPropArrayCollectionCollectionArray([
            [ 'str1' ],
            [ 'str2' ]
        ]);
        value = classInst.getPropArrayCollectionCollectionArray();
        expect(value.length).toBe(2);
        expect(value.get(0).get(0)).toBe('str1');
        expect(value.get(1).get(0)).toBe('str2');
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("default value", function() {
        var data = prop.getDefaultValue();
        expect(data.length).toBe(2);

        expect(data[0][0]).toBe('str11');
        expect(data[0][1]).toBe('str12');
        expect(data[0][2]).toBe('str13');

        expect(data[1][0]).toBe('str21');
        expect(data[1][1]).toBe('str22');
        expect(data[1][2]).toBe('str23');
    });

    it ("watchers", function() {
        expect(classInst.changedPropArrayCollectionCollectionArray).toBe(true);

        expect(classInst.propArrayCollectionCollectionArrayOld.length).toBe(3);
        expect(classInst.propArrayCollectionCollectionArrayOld[0].length).toBe(3);
        expect(classInst.propArrayCollectionCollectionArrayOld[0][0]).toBe('item11');
        expect(classInst.propArrayCollectionCollectionArrayOld[0][1]).toBe('item12');
        expect(classInst.propArrayCollectionCollectionArrayOld[0][2]).toBe('item13');

        expect(classInst.propArrayCollectionCollectionArrayOld[1].length).toBe(3);
        expect(classInst.propArrayCollectionCollectionArrayOld[1][0]).toBe('item21');
        expect(classInst.propArrayCollectionCollectionArrayOld[1][1]).toBe('item22');
        expect(classInst.propArrayCollectionCollectionArrayOld[1][2]).toBe('item23');

        expect(classInst.propArrayCollectionCollectionArrayOld[2].length).toBe(3);
        expect(classInst.propArrayCollectionCollectionArrayOld[2][0]).toBe('item31');
        expect(classInst.propArrayCollectionCollectionArrayOld[2][1]).toBe('item32');
        expect(classInst.propArrayCollectionCollectionArrayOld[2][2]).toBe('item33');

        expect(classInst.propArrayCollectionCollectionArrayNew.length).toBe(2);
        expect(classInst.propArrayCollectionCollectionArrayNew[0][0]).toBe('str1');
        expect(classInst.propArrayCollectionCollectionArrayNew[1][0]).toBe('str2');
    });
});

