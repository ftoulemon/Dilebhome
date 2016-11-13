// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 10, bottom: 30, left: 50},
    width = parseInt(d3.select('#graph1').style('width'), 10),
    width = width - margin.left - margin.right,
    barHeight = 20,
    height = 270 - margin.top - margin.bottom,
    percent = d3.format('%');

// Parse the date / time
var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse,
    bisectDate = d3.bisector(function(d) { return d.date; }).left,
    formatValue = function(d) { return d + "kW"; };

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom")
    .innerTickSize(-height)
    .outerTickSize(0)
    .tickPadding(10);
var yAxis = d3.svg.axis().scale(y)
    .orient("left")
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10);

// Area under the line
var area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.value); });

// Define the line
var valueline = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value); });

// Function to add a linear graph
function addGraph(position, php){
    // Adds the svg canvas
    var svg = d3.select(position)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
    // Get the data
    d3.json(php, function(error, data) {
        data.forEach(function(d) {
            d.date = parseDate(d.ts);
            d.value = +d.value;
        });
        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);
        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);
        // Add the valueline path.
        var path = svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data));
        var totalLength = path.node().getTotalLength();
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1000)
            .ease("linear")
            .attr("stroke-dashoffset", 0);
        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        // Add the Y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        // Manage focus
        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");
        focus.append("circle")
            .attr("r", 4.5);
        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");
        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
            focus.select("text").text(formatValue(d.value));
        }
    });
}

addGraph("#graph1", "dbCon.php");
addGraph("#graph2", "dbCon.php");
