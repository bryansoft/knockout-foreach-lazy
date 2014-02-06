

var config = {paths:{}};
config.paths.test  = "../test"
config.paths.chai  = "../node_modules/chai/chai"


define("jquery", function(){return $})
define("knockout", function(){ return ko})
define("knockout-foreach-lazy", function(){})
require.config(config)
require([
    // FILE(S) BEING TESTED
    '../test/tests'
], function() {
    if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
    else { mocha.run(); }s
});
