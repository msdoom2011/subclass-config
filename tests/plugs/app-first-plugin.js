var appFirstPlugin = Subclass.createModule('appFirstPlugin', {
    plugin: true,
    configs: {
        common: {
            border: false,
            providers: {
                provider_2: {
                    name: "Provider 2 $common.providers.provider_2.className$"
                }
            }
        }
    }
});

//!function() {
//
//    var plug = appFirstPlugin;
//
//    plug.registerClass("Plugs/SearchService", {
//
//        $_extends: 'Search/SearchService',
//
//        getCache: function()
//        {
//            return true;
//        }
//    });
//}();