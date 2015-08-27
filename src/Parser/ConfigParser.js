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
                var configManager = this.getModule().getConfigManager();
                var regex = /\$([^\$]+)\$/i;

                while (regex.test(string)) {
                    var configs = configManager.getConfigs();
                    var configName = string.match(regex)[1];
                    var configValue = eval("(" + "configs." + configName + ")");

                    string = string.replace(
                        regex, this.getParserManager().parse(configValue)
                    );
                }
            }
            return string;
        }
    };

    // Registering Parser

    Subclass.Parser.ParserManager.registerParser(ConfigParser);

    return ConfigParser;
}();
