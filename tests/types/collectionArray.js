//describe("Testing number property type with its", function() {
//
//    var classInst = window.classInstAdvanced;
//    //var classInst = app.getClass('Class/AdvancedDefinition').createInstance();
//    var prop = classInst.getProperty('propStringCollectionArray');
//
//    it ("modifying state before manipulations", function() {
//        expect(prop.isModified()).toBe(false);
//    });
//
//    it ("default value", function() {
//        expect(prop.getDefaultValue().length).toBe(2);
//        expect(prop.getDefaultValue()).toContain('foo');
//        expect(prop.getDefaultValue()).toContain('bar');
//    });
//
//    it ("value", function() {
//        expect(classInst.getPropStringCollectionArray().length).toBe(3);
//        expect(classInst.getPropStringCollectionArray().getItem(0)).toBe('str1');
//        expect(classInst.getPropStringCollectionArray().getItem(1)).toBe('str2');
//        expect(classInst.getPropStringCollectionArray().getItem(2)).toBe('str3');
//
//        var data = classInst.getPropStringCollectionArray().getData();
//        expect(data.length).toBe(3);
//        expect(data).toContain('str1');
//        expect(data).toContain('str2');
//        expect(data).toContain('str3');
//    });
//
//    it ("ability to set new value", function() {
//        classInst.setPropStringCollectionArray([ "item1", "item2" ]);
//        expect(classInst.getPropStringCollectionArray().length).toBe(2);
//        expect(classInst.getPropStringCollectionArray().getItem(0)).toBe('item1');
//        expect(classInst.getPropStringCollectionArray().getItem(1)).toBe('item2');
//
//        expect(function() { classInst.setPropStringCollectionArray("60"); }).toThrow();
//        expect(function() { classInst.setPropStringCollectionArray(true); }).toThrow();
//    });
//
//    it ("nullable", function() {
//        classInst.setPropStringCollectionArray(null);
//        expect(classInst.getPropStringCollectionArray() === null).toBe(true);
//
//        classInst.setPropStringCollectionArray([]);
//        classInst.getPropStringCollectionArray().addItem('item10');
//        expect(classInst.getPropStringCollectionArray().length).toBe(1);
//        expect(classInst.getPropStringCollectionArray().getItem(0)).toBe('item10');
//
//        classInst.setPropStringCollectionArray([ 'item3', 'item4' ]);
//        expect(classInst.getPropStringCollectionArray().length).toBe(2);
//        expect(classInst.getPropStringCollectionArray().getItem(0)).toBe('item3');
//        expect(classInst.getPropStringCollectionArray().getItem(1)).toBe('item4');
//    });
//
//    //it ("ability to throw error if trying to set value which is less then allowed minimum", function() {
//    //    expect(function() { classInst.setPropNumber(-100); }).toThrow();
//    //    expect(classInst.getPropNumber()).toBe(50);
//    //});
//    //
//    //it ("ability to throw error if trying to set value which is more then allowed maximum", function() {
//    //    expect(function() { classInst.setPropNumber(200); }).toThrow();
//    //    expect(classInst.getPropNumber()).toBe(50);
//    //});
//    //
//    //it ("ability to lock its writable capability", function() {
//    //    expect(prop.isLocked()).toBe(false);
//    //    prop.lock();
//    //    classInst.setPropNumber(60);
//    //    expect(classInst.getPropNumber()).toBe(50);
//    //    prop.unlock();
//    //    classInst.setPropNumber(60);
//    //    expect(classInst.getPropNumber()).toBe(60);
//    //});
//    //
//    //it ("modifying state after manipulations", function() {
//    //    expect(prop.isModified()).toBe(true);
//    //});
//    //
//    //it ("watchers", function() {
//    //    expect(classInst.changedPropNumber).toBe(true);
//    //    expect(classInst.propNumberOld).toBe(50);
//    //    expect(classInst.propNumberNew).toBe(60);
//    //});
//});
//
////console.log('');
////console.log('============= arrayCollection property ==============');
////
////var arrayCollection = inst.getTypedArrayCollection();
////console.log(arrayCollection);
////
////arrayCollection.psix = '1111';
////arrayCollection.addItem("psix");
////console.log(arrayCollection.getData());
////
////var filteredItems = arrayCollection.filter(function(element, index) {
////    if (element.match(/^str/)) {
////        return true;
////    }
////});
////console.log(filteredItems);
////
////var removeArrayItem = arrayCollection.indexOf('psix');
////
////console.log(removeArrayItem);
////
////arrayCollection.removeItem(removeArrayItem);
////console.log(arrayCollection.getData());
////
////var removeArrayItemIndex = arrayCollection.indexOf(function(element, index) {
////    if (element.match(/^str/)) {
////        return true;
////    }
////});
////
////console.log(removeArrayItemIndex);
////
////arrayCollection.removeItem(removeArrayItemIndex);
////console.log(arrayCollection.getData());
////
////arrayCollection.addItems(["new1", "new2"]);
////console.log(arrayCollection.getData());
////
////arrayCollection.addItem("psix222");
////console.log(arrayCollection.getData());
////
////var psixElemIndex = arrayCollection.indexOf("psix222");
////console.log(arrayCollection.getItem(psixElemIndex));
////console.log(arrayCollection.getData());
////
////arrayCollection.removeItems();
////console.log(arrayCollection.getData());
////
////inst.setTypedArrayCollection(null);
////console.log(inst.getTypedArrayCollection());
////
////inst.setTypedArrayCollection(["psixNew1", "psixNew2", "psixNew3", "psixNew4"]);
////console.log(inst.getTypedArrayCollection().getData());
////
////arrayCollection.unshift("unshifted");
////arrayCollection.push("pushed");
////
////console.log(arrayCollection.getData());
////
////console.log(arrayCollection.shift());
////console.log(arrayCollection.pop());
////
////console.log(arrayCollection.getData());
////console.log(arrayCollection.length);
////
////arrayCollection.reverse();
////console.log('reversed:', arrayCollection.getData());
////
////arrayCollection.sort();
////console.log('sorted:', arrayCollection.getData());
////
////arrayCollection.sort(function(a, b) {
////    console.log(a,b);
////
////    if (a > b) {
////        return -1;
////    } else if (a < b) {
////        return 1;
////    }
////    return 0;
////});
////
////console.log('custom sorted:', arrayCollection.getData());
////console.log('joined:', arrayCollection.join(", "));
////console.log('sliced from 1 up to 3:', arrayCollection.slice(1,3));
////
////arrayCollection.reverse();
////console.log('reversed to start:', arrayCollection.getData());
////
////
////console.log('');
////console.log('============= arrayCollectionOfMap property ==============');
////
////var arrayCollectionOfMap = inst.getTypedArrayCollectionOfMap();
////console.log(arrayCollectionOfMap);
