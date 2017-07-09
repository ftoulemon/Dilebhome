// Set the dimensions of the canvas / graph
const margin = {top: 30, right: 10, bottom: 140, left: 50},
    widthTmp = parseInt(d3.select('#graphMonth').style('width'), 10),
    width = widthTmp - margin.left - margin.right,
    barHeight = 20,
    height = 400 - margin.top - margin.bottom,
    percent = d3.format('%');

// Parse the date / time
var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S"),
    bisectDate = d3.bisector(function(d) { return d.ts; }).left,
    formatValue = function(d) { return d + "Wh"; };

// Function to add a linear graph
function addGraph(vue, position, php){
    // Set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    // Define the axes
    var xAxis = d3.axisBottom(x)
        .tickSizeInner(-height)
        .tickSizeOuter(0)
        .tickPadding(10)
        .tickFormat(d3.timeFormat("%d-%m-%Y %H:%M:%S"));
    var yAxis = d3.axisLeft(y)
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(10);
    // Area under the line
    var areaHC = d3.area()
        .curve(d3.curveCardinal)
        .x(function(d) { return x(d.ts); })
        .y0(height)
        .y1(function(d) { return y(d.hchcd); });
    var areaHP = d3.area()
        .curve(d3.curveCardinal)
        .x(function(d) { return x(d.ts); })
        .y0(height)
        .y1(function(d) { return y(d.hchpd); });
    // Define the line
    var valuelineHC = d3.line()
        .curve(d3.curveCardinal)
        .x(function(d) { return x(d.ts); })
        .y(function(d) { return y(d.hchcd); });
    var valuelineHP = d3.line()
        .curve(d3.curveCardinal)
        .x(function(d) { return x(d.ts); })
        .y(function(d) { return y(d.hchpd); });

    // Remove previous
    d3.select(position).selectAll("*").remove();
    // Adds the svg canvas
    var svg = d3.select(position)
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
    vue.loading = true;
    // Get the data
    d3.json(php, function(error, data) {
        vue.loading = false;
        data.forEach(function(d) {
            d.ts = parseDate(d.ts);
            d.hchcd = +d.hchcd;
            d.hchpd = +d.hchpd;
        });
        // Scale the range of the data
        x.domain(d3.extent(data, function(d) { return d.ts; }));
        y.domain([0, d3.max(data, function(d) { return Math.max(d.hchcd, d.hchpd); })]);
        svg.append("path")
            .data([data])
            .attr("class", "area")
            .attr("d", areaHC);
        svg.append("path")
            .data([data])
            .attr("class", "area")
            .attr("d", areaHP);
        // Add the valueline path.
        var path = svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#81d4fa")
            .attr("d", valuelineHC);
        var path = svg.append("path")
            .data([data])
            .attr("class", "line")
            .style("stroke", "#4fa0f7")
            .attr("d", valuelineHP);
        var totalLength = path.node().getTotalLength();
        path
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(1000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                    return "rotate(-65)"
                    });
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
            .on("mousemove", mousemoveHC);
        function mousemoveHC() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.ts > d1.ts - x0 ? d1 : d0;
            focus.attr("transform", "translate(" + x(d.ts) + "," + y(d.hchcd) + ")");
            focus.select("text").text(formatValue(d.hchcd));
        }
    });
}


// Function to add a bar graph
function addBarGraph(position, php){
    // axis
    var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
    var y = d3.scaleLinear().rangeRound([height, 0]);
    var z = d3.scaleOrdinal().range(["#81d4fa", "#4fa0f7"]);
    var stack = d3.stack();
    // Define the axes
    var xAxis = d3.axisBottom(x)
        .tickSizeInner(0)
        .tickSizeOuter(0)
        .tickPadding(10)
        .tickFormat(d3.timeFormat("%d-%m-%Y %H:%M:%S"));
    var yAxis = d3.axisLeft(y)
        .tickSizeInner(-width)
        .tickSizeOuter(0)
        .tickPadding(10);
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
            d.ts = parseDate(d.ts);
            d.hc = +d.hchcd;
            d.hp = +d.hchpd;
        });
        // data.sort(function(a, b) { return b.total - a.total; });
        data.columns = ["date", "hc", "hp"];
        x.domain(data.map(function(d) { return d.ts; }));
        y.domain([0, d3.max(data, function(d) { return d.hp + d.hc; })]);
        z.domain(data.columns.slice(1));
        var serie = svg.selectAll(".serie")
            .data(stack.keys(data.columns.slice(1))(data))
            .enter().append("g")
               .attr("class", "serie")
               .attr("fill", function(d) { return z(d.key); });
        serie.selectAll("rect")
           .data(function(d) { return d; })
           .enter().append("rect")
               .attr("x", function(d) { return x(d.data.ts); })
               .attr("y", function(d) { return y(d[1]); })
               .attr("height", function(d) { return y(d[0]) - y(d[1]); })
               .attr("width", x.bandwidth());
        svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
            .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", function(d) {
                    return "rotate(-65)"
                    });
        svg.append("g")
           .attr("class", "axis axis--y")
           .call(yAxis)
         .append("text")
           .attr("x", 2)
           .attr("y", y(y.ticks(10).pop()))
           .attr("dy", "0.35em")
           .attr("text-anchor", "start")
           .attr("fill", "#000")
           .text("Wh");
        var legend = svg.selectAll(".legend")
         .data(data.columns.slice(1).reverse())
         .enter().append("g")
           .attr("class", "legend")
           .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
           .style("font", "10px sans-serif");
        widthGraph = parseInt(d3.select(position).style("width"));
        legend.append("rect")
           .attr("x", widthGraph - 88)
           .attr("width", 18)
           .attr("height", 18)
           .attr("fill", z);
        legend.append("text")
           .attr("x", widthGraph - 94)
           .attr("y", 9)
           .attr("dy", ".35em")
           .attr("text-anchor", "end")
           .text(function(d) { return d; });
    });
}

addBarGraph("#graphHour", "dbCon.php?period=hour");
addBarGraph("#graphDay", "dbCon.php?period=day");
addBarGraph("#graphMonth", "dbCon.php?period=month");

var loadMinuteVue = new Vue({
    el: "#loadminute",
    data: {
        loading: false
    },
    created: function() {
        var me = this;
        addGraph(this, '#graphMinute', "dbCon.php?period=minute");
    },
    components: {
        'load-template': {
            props: ['loading'],
            template: `
                <div class="center" v-if="loading">
                    <loader></loader>
                </div> `
        }
    }
});

// Initialize date picker
var datepicker = $('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 10, // Creates a dropdown of 15 years to control year
    format: 'yyyy-mm-dd',
    onClose: function () {
        addGraph(loadMinuteVue, "#graphMinute", "dbCon.php?period=minute&date="+datepicker[0].value);
        $(document.activeElement).blur();
    }
});
