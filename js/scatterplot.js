var d3 = require('d3');
var colorbrewer = require('colorbrewer');

var SPmargin = {top: 20, right: 20, bottom: 30, left: 40},
   SPwidth = 900 - SPmargin.left - SPmargin.right,
   SPheight = 400 - SPmargin.top - SPmargin.bottom;

var SPsvg = d3.select("body").append("svg")
      .attr("width", SPwidth + SPmargin.left + SPmargin.right)
      .attr("height", SPheight + SPmargin.top + SPmargin.bottom)
      .append("g")
      .attr("transform", "translate(" + SPmargin.left + "," + SPmargin.top + ")");

var x = d3.scale.ordinal()
  .rangeRoundPoints([0,SPwidth],1);

var y = d3.scale.linear()
     .range([SPheight, 0]);

var xAxis = d3.svg.axis()
     .scale(x)
     .orient("bottom");

var yAxis = d3.svg.axis()
     .scale(y)
     .orient("left");

var div = d3.select("body").append("div")   
     .attr("class", "tooltip")
     .style("opacity", 0);

/*var div2 = d3.select("body").append("div")   
     .attr("class", "tooltip")
     .style("opacity", 0);*/

var color = d3.scale.category20();

var color2 = d3.scale.linear()
      //.domain([-5,5])
      .range(["#fb6a4a", "#74c476"])
      .interpolate(d3.interpolateHsl);

var mutatedcolor = "#6baed6";
var highlightcolor = "#f768a1";
var highlightradius = 6.5;

var SP = function(obj) {
    if (obj instanceof SP) return obj;
    if (!(this instanceof SP)) return new SP(obj);
    this.SPwrapped = obj;
};

SP.init = function(){
  
   d3.csv("data/data.csv", function(error, csvdata) {
      if (error) throw error;

      var data = [];

      csvdata.forEach(function(d) {
         if(d.func== "Apoptosis" && !isNaN(parseFloat(d.value)) && isFinite(d.value)) data.push(d);
      });

      data.forEach(function(d) {
         d.value= +d.value;
      });

      x.domain(data.map(function(d) {return d.sample;}));

      var ymin = Math.abs(d3.min(data, function(d) { return d.value; }));
      var ymax = Math.abs(d3.max(data, function(d) { return d.value; }));
      var yabs = Math.max(ymin,ymax);
      y.domain([yabs*-1, yabs]);
      //y.domain([-5,5])

      color2.domain([yabs*-1, yabs]);

      SPsvg.append("g")
         .attr("class", "x axis")
         .attr("transform", "translate(0," + SPheight/2 + ")")
         .call(xAxis)
         .append("text")
         .attr("class", "label")
         .attr("x", SPwidth)
         .attr("y", -6)
         .style("text-anchor", "end")
         .text("Sample");

      SPsvg.append("g")
         .attr("class", "y axis")
         .call(yAxis)
         .append("text")
         .attr("class", "label")
         .attr("transform", "rotate(-90)")
         .attr("y", 6)
         .attr("dy", ".71em")
         .style("text-anchor", "end")
         .text("Log2 Fold change");

      SPsvg.append("rect")
         .attr("class","SPrect")
         .attr("x", SPwidth-180)
         .attr("width", 18)
         .attr("height", 18)
         .style("fill", "#8dd3c7");

      SPsvg.append("text")
         .attr("class","SPtitle")
         .text("Apoptosis")
         .attr("transform", "translate("+(SPwidth-155)+",13)");


      var nodedata = data.map(function(d) {
         return {
            x: x(d.sample),
            y: y(d.value),
            r: 3.5,
            value: d.value,
            sample: d.sample,
            func: d.func,
            gene: d.gene,
            mutation: d.mutation};
      });

      var nodes = SPsvg.selectAll("circle.node")
         .data(nodedata);

      nodes.enter().append("circle")
         .attr("class", "node")
         .attr("r", function(d) { return d.mutation !== "NULL" ? highlightradius : d.r; })
         .attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; })
         .style("fill", function(d){return d.mutation !== "NULL" ? mutatedcolor : color2(d.value);})
         .style("stroke", "black")
         .style("stroke-width", 0.5)
         .on("mouseover", function(d) {
            var muts = d.mutation.split("|");
            var muttext = "<br>";
            for (i = 0; i < muts.length; i++) { 
                muttext += muts[i] + "<br>";
            }
            tooltipheight = (53+muts.length*13).toString()+"px";
            div.transition()        
                  .duration(200)      
                  .style("opacity", 0.9)
                  .style("height", tooltipheight);
            div.html("Gene: " + d.gene + "<br>" +
                     "Function: " + d.func + "<br>"+
                     "Log2 Fold Change: " + d.value + "<br>" +
                     "Mutation: " + muttext)  
                  .style("left", (d3.event.pageX+5) + "px")     
                  .style("top", (d3.event.pageY - 10) + "px");
            //BC1.update(d.sample);
            //BC2.update(d.sample);
            SP.update2(d.gene, d.sample);
         })                  
         .on("mouseout", function(d) {       
             div.transition()        
                 .duration(500)      
                 .style("opacity", 0);   
            //BC1.update("NULL");
            //BC2.update("NULL");
            SP.update2("NULL");
         });
       
       var norm = d3.random.normal(0, 1.5);
       var iterations = 0;
       function collide(node) {
          var r = node.r + 16,
              nx1 = node.x - r,
              nx2 = node.x + r,
              ny1 = node.y - r,
              ny2 = node.y + r;
          return function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
              var x = node.x - quad.point.x,
                  y = node.y - quad.point.y,
                  l = Math.sqrt(x * x + y * y),
                  r = node.r + quad.point.r;
              if (l < r)
                node.x += norm();
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
          };
        }

         while(iterations++ < 100) {
            var q = d3.geom.quadtree(nodedata);
          
            for(var i = 0; i < nodedata.length; i++)
               q.visit(collide(nodedata[i]));
        }

        nodes.transition()
          .attr("cx", function(d) { return d.x; });
   });
};

SP.update = function(nfunc, ncolor){

    d3.csv("data/data.csv", function(error, csvdata) {
        if (error) throw error;
         
        var newdata=[];

         csvdata.forEach(function(d) {
            if(d.func==nfunc && !isNaN(parseFloat(d.value)) && isFinite(d.value)) {newdata.push(d);}
         });

         newdata.forEach(function(d) {
            d.value = +d.value;
         });

         //Update scale domains
         var ymin = Math.abs(d3.min(newdata, function(d) { return d.value; }));
         var ymax = Math.abs(d3.max(newdata, function(d) { return d.value; }));
         var yabs = Math.max(ymin,ymax);
         y.domain([yabs*-1, yabs]);

         color2.domain([yabs*-1, yabs]);

         SPsvg.selectAll("text.SPtitle").text(nfunc);
         SPsvg.selectAll("rect.SPrect").style("fill",ncolor);

         var newnodedata = newdata.map(function(d) {
            return {
               x: x(d.sample),
               y: y(d.value),
               r: 3.5,
               value: d.value,
               sample: d.sample,
               func: d.func,
               gene: d.gene,
               mutation: d.mutation};
         });

         var newnodes = SPsvg.selectAll("circle.node")
            .data(newnodedata);
        
        var norm = d3.random.normal(0, 1.5);
        var iterations = 0;
        function collide(node) {
          var r = node.r + 16,
              nx1 = node.x - r,
              nx2 = node.x + r,
              ny1 = node.y - r,
              ny2 = node.y + r;
          return function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
              var x = node.x - quad.point.x,
                  y = node.y - quad.point.y,
                  l = Math.sqrt(x * x + y * y),
                  r = node.r + quad.point.r;
              if (l < r)
                node.x += norm();
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
          };
        }

         while(iterations++ < 100) {
            var q = d3.geom.quadtree(newnodedata);

            for(var i = 0; i < newnodedata.length; i++)
               q.visit(collide(newnodedata[i]));
        }

         //Update all circles
         newnodes.transition()
            .duration(1000)
            .attr("r", function(d){return d.mutation !== "NULL" ? highlightradius : d.r; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .style("fill", function(d) {return d.mutation !== "NULL" ? mutatedcolor : color2(d.value);});

         //Enter new circles
         newnodes.enter().append("circle")
            .attr("class", "node")
            .attr("r", function(d){return d.mutation !== "NULL" ? highlightradius : d.r; })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .style("fill", function(d) {return d.mutation !== "NULL" ? mutatedcolor : color2(d.value);})
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .on("mouseover", function(d) {      
                var muts = d.mutation.split("|");
                var muttext = "<br>";
                for (i = 0; i < muts.length; i++) { 
                    muttext += muts[i] + "<br>";
                }
                tooltipheight = (53+muts.length*13).toString()+"px";
                div.transition()        
                  .duration(200)      
                  .style("opacity", 0.9)
                  .style("height", tooltipheight);
                div.html("Gene: " + d.gene + "<br>" +
                     "Function: " + d.func + "<br>"+
                     "Log2 Fold Change: " + d.value + "<br>" +
                     "Mutation: " + muttext)  
                  .style("left", (d3.event.pageX+5) + "px")     
                  .style("top", (d3.event.pageY - 10) + "px");
               //BC1.update(d.sample);
               //BC2.update(d.sample);
               SP.update2(d.gene, d.sample);
            })                  
            .on("mouseout", function(d) {       
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);   
               //BC1.update("NULL");
               //BC2.update("NULL");
               SP.update2("NULL");
            });

         // Remove old
         newnodes.exit()
            .transition(1000)
            .attr("r", 0)
            .remove();

         SPsvg.select(".y.axis")
            .transition()
            .duration(1000)
            .call(yAxis);

    });
};

SP.update2 = function(ingene, insample){
    /*var targetgene;
    var targetfunc;
    var targetlog2;
    var targetmut;
    var targetx;
    var targety;*/
    SPsvg.selectAll("circle.node")
          .transition()
          .duration(500)
          .style("fill", function(d) {
                if (d.gene == ingene){
                    /*if (d.sample != insample && (d.sample == "8/3 clone 3" || d.sample == "8/3 clone 4")){
                        targetgene = d.gene;
                        targetfunc = d.func;
                        targetlog2 = d.value;
                        targetmut = d.mutation;
                        targetx = d.x;
                        targety = d.y;
                    }*/
                    return highlightcolor;
                }
                else if (d.mutation !== "NULL") return mutatedcolor;
                else return color2(d.value);
            })
          .attr("r", function(d) {return d.gene == ingene ? highlightradius : d.mutation !== "NULL" ? highlightradius : d.r; });

    /*if (ingene != "NULL"){
        var muts = targetmut.split("|");
        var muttext = "<br>";
        for (i = 0; i < muts.length; i++) { 
            muttext += muts[i] + "<br>";
        }
        tooltipheight = (53+muts.length*13).toString()+"px";
        div2.transition()        
          .duration(200)      
          .style("opacity", 0.9)
          .style("height", tooltipheight);
        div2.html("Gene: " + targetgene + "<br>" +
             "Function: " + targetfunc + "<br>"+
             "Log2 Fold Change: " + targetlog2 + "<br>" +
             "Mutation: " + muttext)  
            .style("left", (targetx+55).toString() + "px")     
            .style("top", (targety+15).toString() + "px");

    }else{
        div2.transition()        
            .duration(500)      
            .style("opacity", 0);  
    }*/

    };


if (typeof define === "function" && define.amd) {
    define(SP);
} else if (typeof module === "object" && module.exports) {
    module.exports = SP;
} else {
    this.SP = SP;
}