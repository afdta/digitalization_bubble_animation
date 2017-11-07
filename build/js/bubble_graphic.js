import degradation from "../../../js-modules/degradation.js";
import dir from "../../../js-modules/rackspace.js";
import waypoint from "../../../js-modules/on-scroll2.js";
import format from "../../../js-modules/formats.js";

import select_menu from "../../../js-modules/select-menu.js";

import dimensions from "../../../js-modules/dimensions.js";
import scope from "../../../js-modules/scope.js";

export default function bubble_graphic(){

	//dom setup
	var outer_wrap = d3.select("#bubble-growth").style("width","100%").style("margin","4rem 0rem 2rem 0rem").style("padding","none")
		.style("border","1px solid #aaaaaa").style("border-width","0px 0px");

	var plot_wrap = outer_wrap.append("div").style("margin","0px auto").classed("plot-wrap",true);

	var xtitle = plot_wrap.append("p").text("DIGITAL SCORE, 2016").style("font-size","0.85rem").style("text-align","left");

	var wrap = plot_wrap.append("div").classed("makesans",false);

	//svg setup
	var svg = wrap.append("svg").attr("width","100%").attr("height","100%");
	var yaxg = svg.append("g");
	
	var xaxgl = svg.append("g");
	var xaxgm = svg.append("g");
	var xaxgh = svg.append("g");

	var xy = svg.append("g").selectAll("line").data([[0,33], [33,60], [60,100]]).enter().append("line");
	
	var pathsg = svg.append("g");
	var maing = svg.append("g");
	var anno = svg.append("g");

	//degradation
	var compat = degradation(wrap.node());

	//data conversion
	var rowFmt = function(row){
		var d = {};
		d.soc = row["occ.code"];
		d.title = row["occ.title"];
		d.score02 = +row["Digital Score, 2002"];
		d.score16 = +row["Digital Score, 2016"];
		d.score_chg = +row["ScoreChange"];
		d.edu = row["Education Requirement"];
		d.skill02 = +row["Digital Skill level_2002"];
		d.skill16 = +row["Digital Skill level_2016"];
		d.high02 = +row["high02"];
		d.medium02 = +row["medium02"];
		d.low02 = +row["low02"];
		d.high16 = +row["high16"];
		d.medium16 = +row["medium16"];
		d.low16 = +row["low16"];
		d.emp02 = +row["tot_emp2002"];
		d.emp16 = +row["tot_emp16"];
		d.awage02 = +row["a_mean02"];
		d.awage16 = +row["a_mean16"];
		d.mwage02 = +row["a_median02"];
		d.mwage16 = +row["a_median16"];
		return d;
	}

	var colors = {low:"#a4c7f2", medium:"#4472c4", high:"#053769"};
	var col = function(score){
		if(score <= 33){var col = colors.low;}
		else if(score >= 60){var col = colors.high;}
		else{var col = colors.medium;}
		return col;
	}

	var sel = select_menu(document.getElementById("bubble-selection"));
	sel.prompt("Select a filter");
	sel.options([{value: "all", text: "Show all 545 occupations"}, 
		{value: "largest", text: "Random selection..."},
		{value: "change", text: "What are meaningful filters? Largest, biggest change?"}]);


	if(compat.browser()){
		d3.csv(dir.url("data", "ForAlec.csv"), rowFmt, function(err, data){

			if(err){
				compat.alert(wrap.node());
			}
			else{
				//parameters
				var filter = null;
				var filters = {

				};

				//set up data and scales
				data.sort(function(a,b){return b.emp16 - a.emp16});

				//padding to allow for axes
				var padding = scope("padding");

				//space between plot data and axes
				var plotpad = scope("plotpad");

				//radius
				var r = d3.scaleSqrt().domain(d3.extent(data, function(d){return d.emp16})).range([0,30]);

				//x-scales
				var xl = d3.scaleLinear().domain([0,33]); 
				var xm = d3.scaleLinear().domain([33,60]);
				var xh = d3.scaleLinear().domain([60,100]);
				var x = d3.scaleLinear().domain([0,100]);

				//x-axes
				var xfmt = function(v){return v%10 == 0 || v == 60 || v == 33 ? format.num0(v) : "";}
				var xaxisl = d3.axisTop(xl).tickFormat(xfmt).tickValues(d3.range(0,35,5)).tickSizeOuter(0).tickSizeInner(4).tickPadding(6);
				var xaxism = d3.axisTop(xm).tickFormat(xfmt).tickValues(d3.range(35,60,5)).tickSizeOuter(0).tickSizeInner(4).tickPadding(6);
				var xaxish = d3.axisTop(xh).tickFormat(xfmt).tickValues(d3.range(60,105,5)).tickSizeOuter(0).tickSizeInner(4).tickPadding(6);

				xaxgl.attr("transform","translate(0" + "," + padding[0] + ")");
				xaxgm.attr("transform","translate(0" + "," + padding[0] + ")");
				xaxgh.attr("transform","translate(0" + "," + padding[0] + ")");

				var xlabels = svg.selectAll("text").data([
														  {v:"high", l:"High", x:100}, 
														  {v:"medium", l:"Medium", x:60}, 
														  {v:"low", l:"Low", x:33}
														]).enter().append("text")
														  .attr("text-anchor","end")
														  .style("fill", function(d){return colors[d.v]})
														  .text(function(d){return d.l});

				var xticks = d3.range(0,110,10);

				xtitle.style("margin-right", (plotpad[1] + padding[1]) + "px").style("text-align","right");

				//y-scales
				var y = d3.scaleLinear().domain([0,100]);
				
				//y-axis
				var yticks = d3.range(0,110,10);
				var yaxis = d3.axisLeft(y).tickFormat(format.num0).tickSizeOuter(8).tickSizeInner(4).tickPadding(6).tickValues(yticks);

				yaxg.attr("transform","translate("+ padding[3] + ",0)");
				
				var ytitle = svg.append("text").text("DIGITAL SCORE, 2012").attr("text-anchor","end").style("font-size","0.85rem");




				/*var vertg = svg.selectAll("g.vline").data(xticks.map(function(d){
					return [{x:d, y1:100, y2:60, v:"high"}, {x:d, y1:60, y2:33, v:"medium"}, {x:d, y1:33, y2:0, v:"low"}];
				})).enter().append("g").classed("vline",true)*/
				var verts = svg.selectAll("path.vline")
								.data(xticks).enter().append("path").classed("vline",true)
								.attr("stroke", function(d){return col(d)})
								.style("shape-rendering","crispEdges")
								.attr("stroke-dasharray",function(d){return d.x==0 ? "2,2" : "2,2"})
								.attr("stroke-width",function(d){return d.x==0 ? "1" : "1"})
								;

				//text_box.style("margin", "0px 0px 0rem " + (padding[3]+plotpad)+"px").style("text-align","left");

				//industry_text.style("margin", "0px 0px 0rem " + (padding[3]+plotpad)+"px").style("text-align","left").style("max-width","780px");
				//xtitle.style("margin", "0px 0px 0px " + (padding[3]+plotpad)+"px").style("text-align","left");

				var init = false; //has initial animation run
				var numdraws = 0; //number of times draw has been run
				var drawtimer;

				function draw(){

					var dims = dimensions();

					var width = dims.viewport.width * 0.95;
					var height = dims.viewport.height * 0.75;

					if(height < 400){height = 400}
					if(width < 320){width = 320}

						console.log(height);
					
					//x-axes setup
					x.range([padding[3]+plotpad[3], width-padding[1]-plotpad[1]]);

					xl.range([x(0), x(33)]);
					xm.range([x(33), x(60)]);
					xh.range([x(60), x(100)]);

					xaxgl.call(xaxisl).selectAll("line, path").attr("stroke",colors.low).style("shape-rendering","crispEdges");
					xaxgm.call(xaxism).selectAll("line, path").attr("stroke",colors.medium).style("shape-rendering","crispEdges");
					xaxgh.call(xaxish).selectAll("line, path").attr("stroke",colors.high).style("shape-rendering","crispEdges");

					xaxgl.selectAll("text").style("fill",colors.low);
					xaxgm.selectAll("text").style("fill",colors.medium);
					xaxgh.selectAll("text").style("fill",colors.high);

					xlabels.attr("transform", function(d){
						if(d.v=="high"){
							var x= xh(d.x);
						}
						else if(d.v=="medium"){
							var x= xm(d.x);
						}
						else{
							var x= xl(d.x);
						}

						return "translate("+x+","+(padding[0]+20)+") rotate(0)";
					});


					//y-axis setup
					y.range([height-padding[2]-plotpad[2], padding[0]+plotpad[0]]);
					
					ytitle.attr("transform", "translate(20,"+y(100)+") rotate(-90)");

					yaxg.call(yaxis).selectAll("line, path").attr("stroke","#aaaaaa").style("shape-rendering","crispEdges");
					yaxg.selectAll("text").style("fill","#333333")
						.style("font-weight", function(d){return d==0 ? null : null})
						;
						/*.style("display", function(d){
							return width < 600 ? (d % 20 == 0 ? "inline" : "none") : "inline";
						});*/

					verts.attr("d", function(d){
						var x1 = x(d);
						var y1= y(0);
						var y2= y(100);

						return "M"+x1+","+y1+" L"+x1+","+y2;
					});

					xy.attr("x1", function(d){return x(d[0])})
					  .attr("y1", function(d){return y(d[0])})
					  .attr("x2", function(d){return x(d[1])})
					  .attr("y2", function(d){return y(d[1])})
					  .attr("stroke", function(d,i){
					  	return i==0 ? colors.low : i==1 ? colors.medium : colors.high;
					  });

					plot_wrap.style("width", width+"px");
					wrap.style("height", height+"px");
					
					//dots
					var dot_data = data.map(function(d,i){

						return {
								i:i,
								y:y(d.score02), 
								x:x(d.score16), 
								x02:x(d.score02),
								r:r(d.emp16), 
								score:d.score16, 
								score02:d.score02,
								col: col(d.score16)
							};
					});



					//dots
					var dots_u = maing.selectAll("circle.occ").data(dot_data);
						dots_u.exit().remove();
					var dots = dots_u.enter().append("circle").classed("occ",true)
									.merge(dots_u)
									.interrupt()
									.attr("cy", function(d){return d.y})
									.attr("cx", function(d){return init ? d.x : d.x02})
									.attr("r", function(d, i){return d.r})
									.attr("fill", function(d, i){return d.col})
									.attr("fill-opacity", 0.85)
									.attr("stroke-width","0.5px")
									.attr("stroke", function(d){
										return "#ffffff";
									})


					sel.callback(function(d){
						if(this=="all"){
							dots.transition().style("opacity",1);
						}
						else{
							dots.transition().style("opacity",function(d,i){
								return Math.random() < 0.1 ? "1" : "0.1";
							});
						}
					});

					//first use
					if(numdraws==0){
						window.addEventListener("resize", function(){
							clearTimeout(drawtimer);
							drawtimer = setTimeout(draw, 250);
						});
					}
					numdraws++;

					//animation hasn't run -- this could be called many times due to resize
					if(!init){

						//paths
						var paths_u = pathsg.selectAll("line.occ").data(dot_data);
							paths_u.exit().remove();
						var paths = paths_u.enter().append("line").classed("occ",true)
										.merge(paths_u)
										.interrupt()
										.attr("y1", function(d){return d.y})
										.attr("y2", function(d){return d.y})
										.attr("x1", function(d){return d.x02})
										.attr("x2", function(d){return d.x02})
										.attr("stroke-width","1px")
										.attr("stroke", function(d){
											return d.col;
										})
										;

						anno.selectAll("g").remove();
						var go = anno.append("g");
							go.append("rect").attr("x", x(0)).attr("width", x(100)-x(0)).attr("y", y(100)).attr("height", y(0)-y(100))
									.attr("fill","#ffffff").attr("fill-opacity","0.8");

							go.append("line").attr("x1", x(0)).attr("x2", x(33)).attr("y1", y(0)).attr("y2", y(33)).attr("stroke", colors.low);
							go.append("line").attr("x1", x(33)).attr("x2", x(60)).attr("y1", y(33)).attr("y2", y(60)).attr("stroke", colors.medium);
							go.append("line").attr("x1", x(60)).attr("x2", x(100)).attr("y1", y(60)).attr("y2", y(100)).attr("stroke", colors.high);

							go.selectAll("line").attr("stroke-width","3");


						go.on("mousedown", function(){
							go.remove();

							paths.transition()
								.delay(function(d){
									return 8000 - (80*d.score02)
								})
								.duration(1000)
								.attr("x2", function(d){
									var offset = d.x >= d.x02 ? 0-d.r : d.r;
									return d.x + offset;
								})
								.transition()
									.duration(500)
									.attr("x1", function(d){
										var offset = d.x >= d.x02 ? 0-d.r : d.r;
										return d.x + offset;										
									})
									.style("opacity","0")
									.on("end", function(){
										d3.select(this).remove();
									})
									;

							dots.transition()
								.delay(function(d){
									return 8000 - (80*d.score02)
								})
								.duration(1000)
								.attr("cx", function(d){return d.x});

							init = true;

						});

					}
				} //end draw

				draw(); //initialize

			}
		});
	}
}