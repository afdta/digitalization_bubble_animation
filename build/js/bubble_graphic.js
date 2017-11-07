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

	var xtitle = plot_wrap.append("p").text("CHANGE IN DIGITAL SCORE, 2002 TO 2016").style("margin","0em 2.5%").style("font-size","0.85rem").style("text-align","right");

	var wrap = plot_wrap.append("div").classed("makesans",false);

	//svg setup
	var svg = wrap.append("svg").attr("width","100%").attr("height","100%");
	var xaxg = svg.append("g");
	
	var yaxgl = svg.append("g");
	var yaxgm = svg.append("g");
	var yaxgh = svg.append("g");
	
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

				var range = d3.extent(data, function(d){return d.score16-d.score02});
				var rangepad = (range[1]-range[0])*0.01;

				var x = d3.scaleLinear().domain([range[0]-rangepad, range[1]+rangepad]);
				var r = d3.scaleSqrt().domain(d3.extent(data, function(d){return d.emp16})).range([0,30]);

				var yl = d3.scaleLinear().domain([0,33]); 
				var ym = d3.scaleLinear().domain([33,60]);
				var yh = d3.scaleLinear().domain([60,100]);
				var y = d3.scaleLinear().domain([0,100]);

				var xticks = d3.range(-20,60,10);
				var xaxis = d3.axisTop(x).tickFormat(format.ch0).tickSizeOuter(8).tickSizeInner(4).tickPadding(6).tickValues(xticks);

				var yfmt = function(v){
					return v%10 == 0 || v == 60 || v == 33 ? format.num0(v) : "";
				}
				
				var yaxisl = d3.axisLeft(yl).tickFormat(yfmt).tickValues(d3.range(0,35,5)).tickSizeOuter(8).tickSizeInner(4).tickPadding(6);
				var yaxism = d3.axisLeft(ym).tickFormat(yfmt).tickValues(d3.range(35,60,5)).tickSizeOuter(8).tickSizeInner(4).tickPadding(6);
				var yaxish = d3.axisLeft(yh).tickFormat(yfmt).tickValues(d3.range(60,105,5)).tickSizeOuter(8).tickSizeInner(4).tickPadding(6);

				//padding to allow for axes
				var padding = scope("padding");

				//space between plot" data and axes
				var plotpad = scope("plotpad");

				xaxg.attr("transform","translate(0,"+ padding[0] + ")");
				yaxgl.attr("transform","translate("+ padding[3] + ",0)");
				yaxgm.attr("transform","translate("+ padding[3] + ",0)");
				yaxgh.attr("transform","translate("+ padding[3] + ",0)");

				var ylabels = svg.selectAll("text").data([
															{v:"high", l:"High", y:100}, 
															{v:"medium", l:"Medium", y:60}, 
															{v:"low", l:"Low", y:33}
														]).enter().append("text")
														  .attr("text-anchor","end")
														  .style("fill", function(d){return colors[d.v]})
														  .text(function(d){return d.l});

				var ytitle = svg.append("text").text("DIGITAL SCORE, 2016").attr("text-anchor","end").style("font-size","0.85rem");

				var vertg = svg.selectAll("g.vline").data(xticks.map(function(d){
					return [{x:d, y1:100, y2:60, v:"high"}, {x:d, y1:60, y2:33, v:"medium"}, {x:d, y1:33, y2:0, v:"low"}];
				})).enter().append("g").classed("vline",true)
				var verts = vertg.selectAll("path")
								.data(function(d){return d}).enter().append("path")
								.attr("stroke", function(d){return colors[d.v]})
								.style("shape-rendering","crispEdges")
								.attr("stroke-dasharray",function(d){return d.x==0 ? null : "2,2"})
								.attr("stroke-width",function(d){return d.x==0 ? "2" : "1"})
								;

				//text_box.style("margin", "0px 0px 0rem " + (padding[3]+plotpad)+"px").style("text-align","left");

				//industry_text.style("margin", "0px 0px 0rem " + (padding[3]+plotpad)+"px").style("text-align","left").style("max-width","780px");
				//xtitle.style("margin", "0px 0px 0px " + (padding[3]+plotpad)+"px").style("text-align","left");

				var sel = null;

				function draw(){

					var dims = dimensions();

					var width = dims.viewport.width * 0.95;
					var height = dims.viewport.height * 0.75;

					if(height < 400){height = 400}
					if(width < 320){width = 320}
					
					x.range([padding[3]+plotpad, width-padding[1]]);

					y.range([height-padding[2]-(3*plotpad), padding[0]+plotpad])
					
					yl.range([y(0)+(2*plotpad), y(33)+(2*plotpad)]);
					ym.range([y(33)+plotpad, y(60)+plotpad]);
					yh.range([y(60), y(100)]);

					var x0 = x(0);
					
					xaxg.call(xaxis).selectAll("line, path").attr("stroke","#aaaaaa").style("shape-rendering","crispEdges");
					xaxg.selectAll("text").style("fill","#333333")
						.style("font-weight", function(d){return d==0 ? "bold" : null})
						.style("display", function(d){
							return width < 600 ? (d % 20 == 0 ? "inline" : "none") : "inline";
						});
					
					yaxgl.call(yaxisl).selectAll("line, path").attr("stroke",colors.low).style("shape-rendering","crispEdges");
					yaxgm.call(yaxism).selectAll("line, path").attr("stroke",colors.medium).style("shape-rendering","crispEdges");
					yaxgh.call(yaxish).selectAll("line, path").attr("stroke",colors.high).style("shape-rendering","crispEdges");

					yaxgl.selectAll("text").style("fill",colors.low);
					yaxgm.selectAll("text").style("fill",colors.medium);
					yaxgh.selectAll("text").style("fill",colors.high);

					ylabels.attr("transform", function(d){
						if(d.v=="high"){
							var y= yh(d.y);
						}
						else if(d.v=="medium"){
							var y= ym(d.y);
						}
						else{
							var y= yl(d.y);
						}

						return "translate("+(padding[3]+20)+","+y+") rotate(-90)";
					});

					ytitle.attr("transform", "translate(20,"+yh(100)+") rotate(-90)");

					verts.attr("d", function(d){
						var x1 = x(d.x);

						if(d.v=="high"){
							var y1= yh(d.y1);
							var y2= yh(d.y2);
						}
						else if(d.v=="medium"){
							var y1= ym(d.y1);
							var y2= ym(d.y2);
						}
						else{
							var y1= yl(d.y1);
							var y2= yl(d.y2);
						}

						return "M"+x1+","+y1+" L"+x1+","+y2;
					});

					plot_wrap.style("width", width+"px");
					wrap.style("height", height+"px");
					
					//dots
					var dot_data = data.map(function(d,i){
						if(d.score16 <= 33){
							var y = yl(d.score16);
							var col = colors.low;
						}
						else if(d.score16 >= 60){
							var y = yh(d.score16);
							var col = colors.high;
						}
						else{
							var y = ym(d.score16);
							var col = colors.medium;
						}

						return {
								i:i, 
								x:x(d.score16-d.score02), 
								y:y, 
								r:r(d.emp16), 
								score:d.score16, 
								col: col
							};
					});

					//dots
					var dots_u = svg.selectAll("circle.occ").data(dot_data);
						dots_u.exit().remove();
					var dots = dots_u.enter().append("circle").classed("occ",true)
									.merge(dots_u)
									.attr("cy", function(d){return d.y})
									.attr("r", function(d, i){return d.r})
									.attr("fill", function(d, i){return d.col})
									.attr("fill-opacity", "0.8")
									.attr("stroke-width","0.5px")
									.attr("stroke", function(d){
										//return d3.color(d.col).darker(0.25);
										return "#ffffff";
									})
									.attr("cx", function(d){return d.x});

					if(sel === null){
						sel = select_menu(document.getElementById("bubble-selection"));
						sel.prompt("Select a filter");
						sel.options([{value: "all", text: "Show all 545 occupations"}, 
							{value: "largest", text: "Random selection..."},
							{value: "change", text: "What are meaningful filters? Largest, biggest change?"}])

						sel.callback(function(d){
							console.log(d.value);
							if(this=="all"){
								dots.transition().style("opacity",1);
							}
							else{
								dots.transition().style("opacity",function(d,i){
									return Math.random() < 0.1 ? "1" : "0.1";
								});
							}
						});
					}
				}

				draw();

				var drawtimer;
				window.addEventListener("resize", function(){
					clearTimeout(drawtimer);
					drawtimer = setTimeout(draw, 250);
				});

			}
		});
	}
}