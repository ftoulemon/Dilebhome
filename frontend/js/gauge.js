const  widthGauge = 300;
const innerRadius = Math.round((widthGauge * 130) / 300);
const outterRadius = Math.round((widthGauge * 145) / 300);
const majorGraduations = 5;
const minorGraduations = 10;
const majorGraduationLenght = Math.round((widthGauge * 16) / 300);
const minorGraduationLenght = Math.round((widthGauge * 10) / 300);
const majorGraduationMarginTop = Math.round((widthGauge * 7) / 300);
const majorGraduationColor = "#B0B0B0";
const minorGraduationColor = "#D0D0D0";
const majorGraduationTextColor = "#6C6C6C";
const needleColor = "#416094";
const valueVerticalOffset = Math.round((widthGauge * 30) / 300);
const unactiveColor = "#D7D7D7";
const majorGraduationTextSize = 12;
const needleValueTextSize = 12;

var maxLimit = 300;
var minLimit = 0;

var scope = {
    value: 0,
    upperLimit: 300,
    lowerLimit: 0,
    valueUnit: "W",
    precision: 0,
    ranges: [
        { min: 0, max: 100, color: '#DEDEDE' },
        { min: 100, max: 150, color: '#8DCA2F' },
        { min: 150, max: 200, color: '#FDC702' },
        { min: 200, max: 250, color: '#FF7700' },
        { min: 250, max: 300, color: '#C50200' } ]
};

var svg;

function addGauge(position){
    svg = d3.select(position)
        .append('svg')
        .attr('width', widthGauge)
        .attr('height', widthGauge * 0.75);

    render();
}

var renderMajorGraduations = function (majorGraduationsAngles) {
    var centerX = widthGauge / 2;
    var centerY = widthGauge / 2;
    //Render Major Graduations
    $.each(majorGraduationsAngles, function (index, value) {
        var cos1Adj = Math.round(Math.cos((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLenght));
        var sin1Adj = Math.round(Math.sin((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLenght));
        var cos2Adj = Math.round(Math.cos((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
        var sin2Adj = Math.round(Math.sin((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
        var x1 = centerX + cos1Adj;
        var y1 = centerY + sin1Adj * -1;
        var x2 = centerX + cos2Adj;
        var y2 = centerY + sin2Adj * -1;
        svg.append("svg:line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .style("stroke", majorGraduationColor);

        renderMinorGraduations(majorGraduationsAngles, index);
    });
};

var renderMinorGraduations = function (majorGraduationsAngles, indexMajor) {
    var minorGraduationsAngles = [];

    if (indexMajor > 0) {
        var minScale = majorGraduationsAngles[indexMajor - 1];
        var maxScale = majorGraduationsAngles[indexMajor];
        var scaleRange = maxScale - minScale;

        for (var i = 1; i < minorGraduations; i++) {
            var scaleValue = minScale + i * scaleRange / minorGraduations;
            minorGraduationsAngles.push(scaleValue);
        }

        var centerX = widthGauge / 2;
        var centerY = widthGauge / 2;
        //Render Minor Graduations
        $.each(minorGraduationsAngles, function (indexMinor, value) {
            var cos1Adj = Math.round(Math.cos((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - minorGraduationLenght));
            var sin1Adj = Math.round(Math.sin((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - minorGraduationLenght));
            var cos2Adj = Math.round(Math.cos((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
            var sin2Adj = Math.round(Math.sin((90 - value) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
            var x1 = centerX + cos1Adj;
            var y1 = centerY + sin1Adj * -1;
            var x2 = centerX + cos2Adj;
            var y2 = centerY + sin2Adj * -1;
            svg.append("svg:line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .style("stroke", minorGraduationColor);
        });
    }
};

var getMajorGraduationValues = function (minLimit, maxLimit) {
    var scaleRange = maxLimit - minLimit;
    var majorGraduationValues = [];
    for (var i = 0; i <= majorGraduations; i++) {
        var scaleValue = minLimit + i * scaleRange / (majorGraduations);
        majorGraduationValues.push(scaleValue.toFixed(scope.precision));
    }

    return majorGraduationValues;
};

var getMajorGraduationAngles = function () {
    var scaleRange = 240;
    var minScale = -120;
    var graduationsAngles = [];
    for (var i = 0; i <= majorGraduations; i++) {
        var scaleValue = minScale + i * scaleRange / (majorGraduations);
        graduationsAngles.push(scaleValue);
    }

    return graduationsAngles;
};

var renderMajorGraduationTexts = function (majorGraduationsAngles, majorGraduationValues) {
    if (!scope.ranges) return;

    var centerX = widthGauge / 2;
    var centerY = widthGauge / 2;
    var textVerticalPadding = 5;
    var textHorizontalPadding = 5;

    var lastGraduationValue = majorGraduationValues[majorGraduationValues.length - 1];
    var textSize = isNaN(majorGraduationTextSize) ? (widthGauge * 12) / 300 : majorGraduationTextSize;
    var fontStyle = textSize + "px";

    var dummyText = svg.append("text")
        .attr("x", centerX)
        .attr("y", centerY)
        .attr("fill", "transparent")
        .attr("text-anchor", "middle")
        .style("font", fontStyle)
        .text(lastGraduationValue + scope.valueUnit);

    var textWidth = dummyText.node().getBBox().width;
    dummyText.remove();

    for (var i = 0; i < majorGraduationsAngles.length; i++) {
        var angle = majorGraduationsAngles[i];
        var cos1Adj = Math.round(Math.cos((90 - angle) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLenght - textHorizontalPadding));
        var sin1Adj = Math.round(Math.sin((90 - angle) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLenght - textVerticalPadding));

        var sin1Factor = 1;
        if (sin1Adj < 0) sin1Factor = 1.1;
        if (sin1Adj > 0) sin1Factor = 0.9;
        if (cos1Adj > 0) {
            if (angle > 0 && angle < 45) {
                cos1Adj -= textWidth / 2;
            } else {
                cos1Adj -= textWidth;
            }
        }
        if (cos1Adj < 0) {
            if (angle < 0 && angle > -45) {
                cos1Adj -= textWidth / 2;
            }
        }
        if (cos1Adj == 0) {
            cos1Adj -= angle == 0 ? textWidth / 4 : textWidth / 2;
        }

        var x1 = centerX + cos1Adj;
        var y1 = centerY + sin1Adj * sin1Factor * -1;

        svg.append("text")
        .attr("class", "mtt-majorGraduationText")
        .style("font", fontStyle)
        .attr("text-align", "center")
        .attr("x", x1)
        .attr("dy", y1)
        .attr("fill", majorGraduationTextColor)
        .text(majorGraduationValues[i] + scope.valueUnit);
    }
};

var renderGraduationNeedle = function (minLimit, maxLimit) {
    svg.selectAll('.mtt-graduation-needle').remove();
    svg.selectAll('.mtt-graduationValueText').remove();
    svg.selectAll('.mtt-graduation-needle-center').remove();

    var centerX = widthGauge / 2;
    var centerY = widthGauge / 2;
    var centerColor;

    if (typeof scope.value === 'undefined') {
        centerColor = unactiveColor;
    } else {
        centerColor = needleColor;
        var needleValue = ((scope.value - minLimit) * 240 / (maxLimit - minLimit)) - 30;
        var thetaRad = needleValue * Math.PI / 180;

        var needleLen = innerRadius - majorGraduationLenght - majorGraduationMarginTop;
        var needleRadius = (widthGauge * 2.5) / 300;
        var topX = centerX - needleLen * Math.cos(thetaRad);
        var topY = centerY - needleLen * Math.sin(thetaRad);
        var leftX = centerX - needleRadius * Math.cos(thetaRad - Math.PI / 2);
        var leftY = centerY - needleRadius * Math.sin(thetaRad - Math.PI / 2);
        var rightX = centerX - needleRadius * Math.cos(thetaRad + Math.PI / 2);
        var rightY = centerY - needleRadius * Math.sin(thetaRad + Math.PI / 2);
        var triangle = "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
        var textSize = isNaN(needleValueTextSize) ? (widthGauge * 12) / 300 : needleValueTextSize;
        var fontStyle = textSize + "px";

        if (scope.value >= minLimit && scope.value <= maxLimit) {
            svg.append("svg:path")
              .attr("d", triangle)
              .style("stroke-width", 1)
              .style("stroke", needleColor)
              .style("fill", needleColor)
              .attr("class", "mtt-graduation-needle");
        }

        svg.append("text")
            .attr("x", centerX)
            .attr("y", centerY + valueVerticalOffset)
            .attr("class", "mtt-graduationValueText")
            .attr("fill", needleColor)
            .attr("text-anchor", "middle")
            .attr("font-weight", "bold")
            .style("font", fontStyle)
            .text('[ ' + scope.value.toFixed(scope.precision) + scope.valueUnit + ' ]');
    }

    var circleRadius = (widthGauge * 6) / 300;

    svg.append("circle")
      .attr("r", circleRadius)
      .attr("cy", centerX)
      .attr("cx", centerY)
      .attr("fill", centerColor)
      .attr("class", "mtt-graduation-needle-center");
}


function render() {
    var d3DataSource = [];

    if (typeof scope.ranges === 'undefined') {
        d3DataSource.push([minLimit, maxLimit, unactiveColor]);
    } else {
        //Data Generation
        $.each(scope.ranges, function (index, value) {
            d3DataSource.push([value.min, value.max, value.color]);
        });
    }

    //Render Gauge Color Area
    var translate = "translate(" + widthGauge / 2 + "," + widthGauge / 2 + ")";
    var cScale = d3.scaleLinear().domain([minLimit, maxLimit]).range([-120 * (Math.PI / 180), 120 * (Math.PI / 180)]);
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outterRadius)
        .startAngle(function (d) { return cScale(d[0]); })
        .endAngle(function (d) { return cScale(d[1]); });
    svg.selectAll("path")
        .data(d3DataSource)
        .enter()
        .append("path")
        .attr("d", arc)
        .style("fill", function (d) { return d[2]; })
        .attr("transform", translate);

    var majorGraduationsAngles = getMajorGraduationAngles();
    var majorGraduationValues = getMajorGraduationValues(minLimit, maxLimit);
    renderMajorGraduations(majorGraduationsAngles);
    renderMajorGraduationTexts(majorGraduationsAngles, majorGraduationValues);
    renderGraduationNeedle(minLimit, maxLimit);
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function gaugeCallback(text) {
    data = JSON.parse(text);
    scope.value = parseInt(data[0].hchcd);
    addGauge("#gauge1");

    scope.value = parseInt(data[0].hchpd);
    addGauge("#gauge2");
}

httpGetAsync("dbCon.php?period=last", gaugeCallback);

