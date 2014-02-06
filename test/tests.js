
define(function(require){
    var $ = require("jquery")
    var ko = require("knockout");
    require("knockout-foreach-lazy");
    var expect = require("chai").expect;


    var clock;
    describe("Basic Lazy List Test", function(){

        beforeEach(function(){
            clock = sinon.useFakeTimers();
        })

        afterEach(function(){
            clock.restore();
        })

        it("Interference Test 1: no 'lazy' attribute should make the foreach act normally", function(){
            var model = {
                customers: ko.observable([
                    {name:"bob"},
                    {name:"billy"},
                    {name:"jenny"}])
            };
            ko.applyBindings(model, $("#interference-test1")[0]);

            expect($("#interference-test1 li")).to.have.length(model.customers().length);
        })
        it("Interference Test 2: Should still replicate basic foreach functionality with lazy", function(){
            var model = {
                title:"customerList",
                customers: ko.observable([
                    {name:"bob"},
                    {name:"billy"},
                    {name:"jenny"}])
            };
            var id = "#interference-test2"
            ko.applyBindings(model, $(id)[0]);

            expect($(id + " li")).to.have.length(model.customers().length);
            expect($(id + " li")[0].innerHTML).to.contain("bob");
            expect($(id + " li")[1].innerHTML).to.contain("billy");
            expect($(id + " li")[2].innerHTML).to.contain("jenny");
            expect($(id + " li")[0].innerHTML).to.contain("customerList");
            expect($(id + " li")[1].innerHTML).to.contain("customerList");
            expect($(id + " li")[2].innerHTML).to.contain("customerList");
        })

        it("Interference Test 3: Should still know how templates and aliases work", function(){
            var model = {
                customers: ko.observable([
                    {name:"bob"},
                    {name:"billy"},
                    {name:"jenny"}])
            };
            var id = "#interference-test3";
            ko.applyBindings(model, $(id)[0]);

            expect($(id + " li")).to.have.length(model.customers().length);
            expect($(id + " li")[0].innerHTML).to.contain("bob");
            expect($(id + " li")[1].innerHTML).to.contain("billy");
            expect($(id + " li")[2].innerHTML).to.contain("jenny");
        })

        it("Interference Test 4: Should still work properly inside a virtual element!", function(){
            var model = {
                customers: ko.observable([
                    {name:"bob"},
                    {name:"billy"},
                    {name:"jenny"}])
            };
            var id = "#interference-test4";
            ko.applyBindings(model, $(id)[0]);

            expect($(id + " li")).to.have.length(model.customers().length);
            expect($(id + " li")[0].innerHTML).to.contain("bob");
            expect($(id + " li")[1].innerHTML).to.contain("billy");
            expect($(id + " li")[2].innerHTML).to.contain("jenny");
        })



        it("should only render items within the viewport", function(){
            var customers = [];
            for(var i = 0; i < 1000; i++){
                customers.push({name: "customer #" + i});
            }
            var model = {
                title:"customerList",
                customers: ko.observable(customers)
            };
            ko.applyBindings(model, $("#viewport-rendering-test")[0]);

            expect($("#viewport-rendering-test li")).to.have.length(10);
        })


        it("scrolling down a page should render the next set of elements", function(){
            var customers = [];
            for(var i = 0; i < 1000; i++){
                customers.push({name: "customer #" + i});
            }
            var model = {
                title:"customerList",
                customers: ko.observable(customers)
            };
            ko.applyBindings(model, $("#viewport-then-scroll-test")[0]);

            $("#viewport-then-scroll-test .scroller").scrollTop(200);

            // Force the scroll to be triggered
            $("#viewport-then-scroll-test .scroller").trigger("scroll");

            expect($("#viewport-then-scroll-test li")).to.have.length(10);
            expect($("#viewport-then-scroll-test li")[0].innerHTML).to.contain("customer #10");
            expect($($("#viewport-then-scroll-test .view-container")[0]).position().top).to.equal(200);
        })


        it("should round down to the last element to render", function(){
            var customers = [];
            for(var i = 0; i < 1000; i++){
                customers.push({name: "customer #" + i});
            }
            var model = {
                title:"customerList",
                customers: ko.observable(customers)
            };
            var id = "#round-down-to-last-element";

            ko.applyBindings(model, $(id)[0]);

            $(id + " .scroller").scrollTop(205);

            // Force the scroll to be triggered
            $(id + " .scroller").trigger("scroll");

            expect($(id + " li")).to.have.length( 10);
            expect($(id + " li")[0].innerHTML).to.contain("customer #10");
            expect($($(id + " .view-container")[0]).position().top).to.equal(200);
        })



        it("should only render after a given period due to a throttle on the scrollTopDelayed observable", function(){
            var customers = [];
            for(var i = 0; i < 1000; i++){
                customers.push({name: "customer #" + i});
            }
            var model = {
                title:"customerList",
                customers: ko.observable(customers)
            };
            var id = "#render-scroll-throttle-test";

            ko.applyBindings(model, $(id)[0]);

            $(id + " .scroller").scrollTop(400);
            // Force the scroll to be triggered
            $(id + " .scroller").trigger("scroll");

            expect($(id + " li")).to.have.length( 10);
            expect($(id + " li")[0].innerHTML).to.contain("customer #0");
            expect($($(id + " li")[0]).position().top).to.equal(0);

            clock.tick(200);

            expect($(id + " li")).to.have.length( 10);
            expect($(id + " li")[0].innerHTML).to.contain("customer #20");
            expect($($(id + " .view-container")[0]).position().top).to.equal(400);
        })

    })

})

