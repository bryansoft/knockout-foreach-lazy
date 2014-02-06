    (function (factory) {
        // Note: taken from knockout.mapping examples
        // Module systems magic dance.

        if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
            // CommonJS or Node: hard-coded dependency on "knockout"
            factory(require("jquery"), require("knockout"));
        } else if (typeof define === "function" && define["amd"]) {
            // AMD anonymous module with hard-coded dependency on "knockout"
            define(["jquery", "knockout"], factory);
        } else {
            // <script> tag: use the global `ko` object, overriding the foreach loop
            factory($, ko);
        }
    }(function ($, ko) {

        var log = function(message){console.log(message)};
        var error = function(message){console.error(message)};

        function createViewContainer(elementHeight, viewHeight){
            // The view container is the div that is always in view when scrolling.
            // Items are being added and removed on the fly. This container will be move
            // with the viewport
            var $viewContainer = $("<div class='view-container'></div>");
            $viewContainer.css("position", "absolute");
            $viewContainer.height(viewHeight + "px");
            $viewContainer.width("100%")
            return $viewContainer;


        }

        function createItemContainer(elementHeight, count){
            // The item container primarily makes the viewable area = elementHeight * array size
            // It will be added to the element with the foreach binding
            var $itemContainer = $("<div class='item-container'></div>");
            $itemContainer.css("position", "relative");
            $itemContainer.height(elementHeight * count + "px");
            $itemContainer.width("100%")
            return $itemContainer;
        }

        function moveTemplate(element, $to){
            var children = ko.virtualElements.childNodes(element);
            for(var i = children.length - 1; i >= 0; i--){
                $to.append(children[i]);
            }
        }

        var unwrap = ko.utils.unwrapObservable;

        var originalInit = ko.bindingHandlers["foreach"].init;
        var originalUpdate = ko.bindingHandlers["foreach"].update;
        ko.bindingHandlers["foreach"] = $.extend(ko.bindingHandlers["foreach"],{
            init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                if(!allBindings().lazy){
                    return originalInit.apply(this, arguments);
                }
                else{

                    // Get the template for rendering child items
                    var template = null;
                    var elementHeight = allBindings().lazy.itemHeight;
                    var list = unwrap(valueAccessor().data) || unwrap(valueAccessor());
                    var $viewport = $(element.nodeName == "#comment" ? element.parentNode : element);

                    // Spans the whole scrollable area
                    var $itemContainer = createItemContainer(elementHeight, list.length);
                    // Just the visible area;
                    var $viewContainer = createViewContainer($viewport.height());
                    moveTemplate(element, $viewContainer);

                    ko.virtualElements.emptyNode(element);
                    ko.virtualElements.prepend(element, $itemContainer[0])
                    ko.virtualElements.prepend($itemContainer[0], $viewContainer[0]);

                    var state = {
                        scrollTop: ko.observable(0),
                        list: list,
                        visibleList: ko.observable([]),
                        $itemContainer: $itemContainer,
                        $viewContainer: $viewContainer,
                        elementHeight: elementHeight,
                        $viewport: $viewport,

                        render: function(){
                            var top = this.$viewport.scrollTop();
                            var viewSize = this.$viewport.height();
                            var currentTop = Math.floor(top/elementHeight) * elementHeight;
                            var startIdx = currentTop/elementHeight;
                            var endIdx = Math.ceil((currentTop + viewSize)/elementHeight);

                            this.visibleList(list.slice(startIdx, endIdx));
                            originalUpdate.apply(this, [$viewContainer[0], state.valueAccessor, allBindings, viewModel, bindingContext])

                            $viewContainer.css("top", startIdx * elementHeight + "px");
                        },

                        valueAccessor: function(){
                            var value = valueAccessor();
                            if(value.data){
                                value.data = state.visibleList;
                            }
                            else{
                                value = state.visibleList;
                            }
                            return value;
                        }
                    }
                    state.scrollTopDelayed = ko.computed(function(){ return state.scrollTop()});
                    if(allBindings().lazy.throttle){
                        state.scrollTopDelayed = state.scrollTopDelayed.extend({throttle: allBindings().lazy.throttle});
                    }
                    originalInit.apply(this, [$viewContainer[0], state.valueAccessor, allBindings, viewModel, bindingContext])

                    state.scrollTopDelayed.subscribe(function(){
                        state.render();
                    })
                    state.$viewport.scroll(function(){
                        state.scrollTop(state.$viewport.scrollTop())
                    })
                    state.render();
                    return { controlsDescendantBindings: true }
                }
            },
            update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
                if(!allBindings().lazy){
                    return originalUpdate.apply(this, arguments);
                }
                else{

                }
            }
        });
    }));