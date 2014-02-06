#knockout-foreach-lazy

knockout-foreach-lazy is an extension for the current "foreach" binding that only draws content visible in a scrollable viewport. This should server as a performance
improvement for anyone who is rendering a list that is larger than the visible area.

## Syntax
The knockout-foreach-lazy library uses an additional binding of `lazy:{options}` 
along with the original `foreach` binding. An example of such would be:

    <ul data-bind="foreach: customers, lazy:{itemHeight:20}" style="overflow:scroll">
        <li data-bind="text: firstName"></li>
    </ul>
Note that the lazy binding is simply tacked on to the end, and has some parameters of its own.

## Parameters
`itemHeight`
<br/>
Item height is the physical height, in pixels, of the foreach template. In the above case, this was the `<li data-bind="text: firstName"></li>` element. Future versions will probably find an automatic version of this property. This limitation allows the knockout-foreach-lazy library to calculate what elements to render based on where the user has scrolled in the list. 

<br/>
`throttle`
<br/>
The throttle parameter will apply a knockout throttle (milliseconds) to the rendered list. This is helpful when the foreach template is rather complex. Although not required, a throttle value is recommended to reduce the processing as the user scrolls the list.

## How it works
Sometimes getting a peek under the covers will explain the benefit/limitations to this approach. The following markup:
    
    <ul data-bind="foreach: customers, lazy:{itemHeight:20}">
        <li data-bind="text: firstName"></li>
    </ul>
Will be transformed into:

    <ul data-bind="foreach: customers, lazy:{itemHeight:20}">
        <div class="itemContainer"> <!-- height will equal: itemHeight * customers.length -->
            <div class="viewContainer"> <!-- height will be the viewSize, it will follow the scrollbar -->
                <li>Billy</li>
                <li>Kelly</li>
                ...
                ... repeated until the viewContainer is filled...
                <li>Mark</li>
            </div>
        </div>
    </ul>
    
## Demo
A demo can be found at this project's github website: http://bryansoft.github.io/knockout-foreach-lazy
