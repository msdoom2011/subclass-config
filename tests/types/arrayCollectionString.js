describe("Testing array collection property type with its", function() {

    var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
    var prop = classInst.getProperty('propStringCollectionArray');

    it ("modifying state before manipulations", function() {
        expect(prop.isModified()).toBe(false);
    });

    it ("value", function() {
        expect(classInst.getPropStringCollectionArray().length).toBe(3);
        expect(classInst.getPropStringCollectionArray().get(0)).toBe('str1');
        expect(classInst.getPropStringCollectionArray().get(1)).toBe('str2');
        expect(classInst.getPropStringCollectionArray().get(2)).toBe('str3');

        var data = classInst.getPropStringCollectionArray().getData();
        expect(data.length).toBe(3);
        expect(data).toContain('str1');
        expect(data).toContain('str2');
        expect(data).toContain('str3');
    });

    it ("ability to set new value", function() {
        classInst.setPropStringCollectionArray([ "item1", "item2" ]);
        expect(classInst.getPropStringCollectionArray().length).toBe(2);
        expect(classInst.getPropStringCollectionArray().get(0)).toBe('item1');
        expect(classInst.getPropStringCollectionArray().get(1)).toBe('item2');

        expect(function() { classInst.setPropStringCollectionArray("60"); }).toThrow();
        expect(function() { classInst.setPropStringCollectionArray(true); }).toThrow();
    });

    it ("nullable", function() {
        classInst.setPropStringCollectionArray(null);
        expect(classInst.getPropStringCollectionArray() === null).toBe(true);

        classInst.setPropStringCollectionArray([]);
        classInst.getPropStringCollectionArray().add('item10');
        expect(classInst.getPropStringCollectionArray().length).toBe(1);
        expect(classInst.getPropStringCollectionArray().get(0)).toBe('item10');

        classInst.setPropStringCollectionArray([ 'item3', 'item4' ]);
        expect(classInst.getPropStringCollectionArray().length).toBe(2);
        expect(classInst.getPropStringCollectionArray().get(0)).toBe('item3');
        expect(classInst.getPropStringCollectionArray().get(1)).toBe('item4');
    });

    it ("manipulations with collection items", function() {
        var prop = classInst.getPropStringCollectionArray();

        // removing all
        prop.removeItems();
        expect(prop.length).toBe(0);

        // add items
        prop.addItems(['item1', 'item2', 'item3']);
        expect(prop.length).toBe(3);
        expect(prop.get(0)).toBe('item1');
        expect(prop.get(1)).toBe('item2');
        expect(prop.get(2)).toBe('item3');

        // add item
        prop.add('item4');
        expect(function() { prop.add(true); }).toThrow();
        expect(prop.length).toBe(4);
        expect(prop.get(3)).toBe('item4');

        // push item
        prop.push('item5');
        expect(prop.length).toBe(5);
        expect(prop.get(4)).toBe('item5');

        // pop item
        expect(prop.pop()).toBe('item5');
        expect(prop.length).toBe(4);

        // unshift item
        prop.unshift('item0');
        expect(prop.length).toBe(5);
        expect(prop.get(0)).toBe('item0');
        expect(prop.get(1)).toBe('item1');
        expect(prop.get(2)).toBe('item2');
        expect(prop.get(3)).toBe('item3');
        expect(prop.get(4)).toBe('item4');

        // shift item
        expect(prop.shift()).toBe('item0');
        expect(prop.length).toBe(4);

        // remove one item
        prop.remove(3);
        expect(prop.length).toBe(3);
        expect(prop.isset(3)).toBe(false);
        expect(function() { prop.get(3); }).toThrow();

        // set one item
        prop.set(0, 'item100');
        expect(prop.get(0)).toBe('item100');
        prop.set(0, 'item1');
        prop.set(10, 'item10');
        expect(prop.length).toBe(11);
        expect(prop.get(4)).toBe('');
        expect(prop.get(7)).toBe('');

        // removing a few items
        prop.removeItems(7, 2);
        expect(prop.length).toBe(9);
        expect(prop.get(8)).toBe('item10');
        prop.removeItems(3);
        expect(prop.length).toBe(3);
        expect(prop.get(prop.length - 1)).toBe('item3');

        // set a few items
        prop.setItems(['item11', 'item22', 'item33', 'item44']);
        expect(prop.length).toBe(4);
        expect(prop.get(0)).toBe('item11');
        expect(prop.get(1)).toBe('item22');
        expect(prop.get(2)).toBe('item33');
        expect(prop.get(3)).toBe('item44');

        // replace items
        prop.replaceItems(['item1', 'item2', 'item3']);
        expect(prop.length).toBe(3);
        expect(prop.get(0)).toBe('item1');
        expect(prop.get(1)).toBe('item2');
        expect(prop.get(2)).toBe('item3');

        // each items
        prop.forEach(function(value, key) {
            switch(key) {
                case 0:
                    expect(value).toBe('item1');
                    break;
                case 1:
                    expect(value).toBe('item2');
                    break;
                case 2:
                    expect(value).toBe('item3');
                    break;
                default:
                    expect(true).toBe(false);
                    break;
            }
        });

        // indexOf method
        prop.unshift('item1');
        expect(prop.indexOf('unexistent')).toBe(-1);
        expect(prop.indexOf('item1')).toBe(0);
        expect(prop.indexOf('item2')).toBe(2);
        expect(prop.indexOf(function(value, key) {
            return value == 'item2';
        })).toBe(2);

        // lastIndexOf method
        expect(prop.lastIndexOf('unexistent')).toBe(-1);
        expect(prop.lastIndexOf('item1')).toBe(1);
        expect(prop.lastIndexOf('item2')).toBe(2);
        expect(prop.lastIndexOf(function(value, key) {
            return value == 'item2';
        })).toBe(2);
        prop.shift();

        // join method
        expect(prop.join()).toBe('item1,item2,item3');
        expect(prop.join('. ')).toBe('item1. item2. item3');

        // swap items method
        prop.swap(0, 2);
        expect(prop.get(0)).toBe('item3');
        expect(prop.get(2)).toBe('item1');
        prop.swap(0, 2);
        expect(prop.get(0)).toBe('item1');
        expect(prop.get(2)).toBe('item3');
        prop.swap(1, 2);
        expect(prop.get(1)).toBe('item3');
        expect(prop.get(2)).toBe('item2');
        prop.swap(1, 2);
        expect(prop.get(1)).toBe('item2');
        expect(prop.get(2)).toBe('item3');

        // reverse items order
        prop.reverse();
        expect(prop.get(0)).toBe('item3');
        expect(prop.get(1)).toBe('item2');
        expect(prop.get(2)).toBe('item1');
        prop.reverse();
        expect(prop.get(0)).toBe('item1');
        expect(prop.get(1)).toBe('item2');
        expect(prop.get(2)).toBe('item3');

        // sort items
        prop.sort(function(a, b) {
            if (a > b) {
                return -1;
            } else if (a < b) {
                return 1;
            }
            return 0;
        });
        expect(prop.get(0)).toBe('item3');
        expect(prop.get(1)).toBe('item2');
        expect(prop.get(2)).toBe('item1');
        prop.reverse();

        // slice method
        var slicedArr = prop.slice(1, 2);
        expect(slicedArr.length).toBe(1);
        expect(slicedArr).toContain('item2');

        // filter method
        var filterResult = prop.filter(function(value, key) {
            return value == 'item2' || key == 2;
        });
        expect(filterResult.length).toBe(2);
        expect(filterResult).toContain('item2');
        expect(filterResult).toContain('item3');

        // getting data
        var propData = prop.getData();
        expect(propData.length).toBe(3);
        expect(propData).toContain('item1');
        expect(propData).toContain('item2');
        expect(propData).toContain('item3');

    });

    it ("ability to lock its writable capability", function() {
        expect(prop.isLocked()).toBe(false);
        prop.lock();

        classInst.setPropStringCollectionArray(['str1', 'str2']);
        expect(classInst.getPropStringCollectionArray().length).toBe(3);
        expect(classInst.getPropStringCollectionArray().get(0)).toBe('item1');
        expect(classInst.getPropStringCollectionArray().get(1)).toBe('item2');
        expect(classInst.getPropStringCollectionArray().get(2)).toBe('item3');

        prop.unlock();
        classInst.setPropStringCollectionArray(['str1', 'str2']);
        expect(classInst.getPropStringCollectionArray().length).toBe(2);
        expect(classInst.getPropStringCollectionArray().get(0)).toBe('str1');
        expect(classInst.getPropStringCollectionArray().get(1)).toBe('str2');
    });

    it ("modifying state after manipulations", function() {
        expect(prop.isModified()).toBe(true);
    });

    it ("default value", function() {
        expect(prop.getDefaultValue().length).toBe(2);
        expect(prop.getDefaultValue()).toContain('foo');
        expect(prop.getDefaultValue()).toContain('bar');
    });

    it ("watchers", function() {
        expect(classInst.changedPropStringCollectionArray).toBe(true);

        expect(classInst.propStringCollectionArrayOld.length).toBe(3);
        expect(classInst.propStringCollectionArrayOld[0]).toBe('item1');
        expect(classInst.propStringCollectionArrayOld[1]).toBe('item2');
        expect(classInst.propStringCollectionArrayOld[2]).toBe('item3');

        expect(classInst.propStringCollectionArrayNew.length).toBe(2);
        expect(classInst.propStringCollectionArrayNew[0]).toBe('str1');
        expect(classInst.propStringCollectionArrayNew[1]).toBe('str2');
    });
});