/**
 * @class
 * @constructor
 */
Subclass.Parser.ConfigParser = function()
{
    function ConfigParser()
    {
        ConfigParser.$parent.apply(this, arguments);
    }

    ConfigParser.$parent = Subclass.Parser.ParserAbstract;

    /**
     * @inheritDoc
     */
    ConfigParser.getName = function()
    {
        return "config";
    };

    ConfigParser.prototype = {

        /**
         * @inheritDoc
         */
        parse: function(string)
        {
            if (typeof string == 'string' && string.match(/\$.+\$/i)) {
                var parserManager = this.getParserManager();
                var moduleInstance = parserManager.getModuleInstance();
                var configContainer = moduleInstance.getConfigContainer();
                var configManager = configContainer.getConfigManager();
                var regExpStr = "\\$([^\\$]+)\\$";
                var regExp = new RegExp(regExpStr, "i");
                var configs = configContainer.getConfigs() || configManager.getDefaults();
                var configName, configValue;

                if (!(new RegExp("^" + regExpStr + "$", "i")).test(string)) {
                    while (regExp.test(string)) {
                        configName = string.match(regExp)[1];
                        configValue = eval("(" + "configs." + configName + ")");
                        string = string.replace(regExp, this.getParserManager().parse(configValue));
                    }
                } else {
                    configName = string.match(regExp)[1];
                    configValue = eval("(" + "configs." + configName + ")");
                    string = this.getParserManager().parse(configValue);
                }
            }
            return string;
        }
    };

    // Registering Parser

    Subclass.Parser.ParserManager.registerParser(ConfigParser);

    return ConfigParser;
}();
