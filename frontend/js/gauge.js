 var width = 300;
 var innerRadius = Math.round((width * 130) / 300);
 var outterRadius = Math.round((width * 145) / 300);
 var majorGraduations = 5;
 var minorGraduations = 10;
 var majorGraduationLenght = Math.round((width * 16) / 300);
 var minorGraduationLenght = Math.round((width * 10) / 300);
 var majorGraduationMarginTop = Math.round((width * 7) / 300);
 var majorGraduationColor = "#B0B0B0";
 var minorGraduationColor = "#D0D0D0";
 var majorGraduationTextColor = "#6C6C6C";
 var needleColor = "#416094";
 var valueVerticalOffset = Math.round((width * 30) / 300);
 var unactiveColor = "#D7D7D7";
 var majorGraduationTextSize = 12;
 var needleValueTextSize = 12;

 var maxLimit = 6;
 var minLimit = 0;

 var scope = {
    value: 1.5,
    upperLimit: 6,
    lowerLimit: 0,
    valueUnit: "kW",
    precision: 2,
    ranges: [
        { min: 0, max: 1.5, color: '#DEDEDE' },
        { min: 1.5, max: 2.5, color: '#8DCA2F' },
        { min: 2.5, max: 3.5, color: '#FDC702' },
        { min: 3.5, max: 4.5, color: '#FF7700' },
        { min: 4.5, max: 6.0, color: '#C50200' } ]
 };

var svg;

 function addGauge(position){
     svg = d3.select(position)
         .append('svg')
         .attr('width', width)
         .attr('height', width * 0.75);

     render();
 }

 var renderMajorGraduations = function (majorGraduationsAngles) {
     var centerX = width / 2;
     var centerY = width / 2;
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

         var centerX = width / 2;
         var centerY = width / 2;
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

     var centerX = width / 2;
     var centerY = width / 2;
     var textVerticalPadding = 5;
     var textHorizontalPadding = 5;

     var lastGraduationValue = majorGraduationValues[majorGraduationValues.length - 1];
     var textSize = isNaN(majorGraduationTextSize) ? (width * 12) / 300 : majorGraduationTextSize;
     var fontStyle = textSize + "px Courier";

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
     
     var centerX = width / 2;
     var centerY = width / 2;
     var centerColor;

     if (typeof scope.value === 'undefined') {
         centerColor = unactiveColor;
     } else {
         centerColor = needleColor;
         var needleValue = ((scope.value - minLimit) * 240 / (maxLimit - minLimit)) - 30;
         var thetaRad = needleValue * Math.PI / 180;

         var needleLen = innerRadius - majorGraduationLenght - majorGraduationMarginTop;
         var needleRadius = (width * 2.5) / 300;
         var topX = centerX - needleLen * Math.cos(thetaRad);
         var topY = centerY - needleLen * Math.sin(thetaRad);
         var leftX = centerX - needleRadius * Math.cos(thetaRad - Math.PI / 2);
         var leftY = centerY - needleRadius * Math.sin(thetaRad - Math.PI / 2);
         var rightX = centerX - needleRadius * Math.cos(thetaRad + Math.PI / 2);
         var rightY = centerY - needleRadius * Math.sin(thetaRad + Math.PI / 2);
         var triangle = "M " + leftX + " " + leftY + " L " + topX + " " + topY + " L " + rightX + " " + rightY;
         var textSize = isNaN(needleValueTextSize) ? (width * 12) / 300 : needleValueTextSize;
         var fontStyle = textSize + "px Courier";

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

     var circleRadius = (width * 6) / 300;

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
     var translate = "translate(" + width / 2 + "," + width / 2 + ")";
     var cScale = d3.scale.linear().domain([minLimit, maxLimit]).range([-120 * (Math.PI / 180), 120 * (Math.PI / 180)]);
     var arc = d3.svg.arc()
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

addGauge("#gauge1");
addGauge("#gauge2");
