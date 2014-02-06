

var config = loadedConfig;
config.baseUrl = "../src"
config.paths.test  = "../test"
config.paths.chai  = "../node_modules/chai/chai"
config.paths["knockout-foreach-lazy"]  = "../src/knockout-foreach-lazy"

require.config(config)
require([
    // FILE(S) BEING TESTED
    '../test/tests'
], function() {
    // INITIALIZE THE RUN
    if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
    else { mocha.run(); }
});
