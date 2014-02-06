

// Really weird. Require build.js uses a parser that just looks for
// "require.config({" and doesn't parse the json.
// This allows us to capture the config we are using so that the test
// Scripts can reconfigured with their test libraries tagged in...
var original = require.config;
require.config = function(){
    loadedConfig = arguments[0];
    original.apply(require, arguments)
}

require.config({
    paths:{
        "jquery":     "../bower_components/jquery/jquery",
        "knockout": "../bower_components/knockout.js/knockout"
    }
});
