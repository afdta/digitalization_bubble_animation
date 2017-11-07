import degradation from "../../../js-modules/degradation.js";
import dir from "../../../js-modules/rackspace.js";
import waypoint from "../../../js-modules/on-scroll2.js";

import dimensions from "../../../js-modules/dimensions.js";

export default function bubble_graphic(){
	var outer_wrap = d3.select("#bubble-growth").style("width","100%").style("margin","4rem 0rem 2rem 0rem")
		.style("border","1px solid #aaaaaa").style("border-width","0px 0px");

	var text_container = outer_wrap.append("div").style("position","relative").style("margin-bottom","1rem").classed("col-center big-col",true);
	var invisible_text = text_container.append("div").classed("big-text-scroll",true).append("p").style("visibility","hidden").classed("no-select",true);
	var textpan = text_container.append("div").classed("big-text-scroll",true).style("position","absolute").style("bottom","0px").append("p");

	textpan.append("span").text("Digitalization scores rose in 517 of 545 analyzed occupations from 2002 to 2016.");

	var title = outer_wrap.append("div").classed("col-center big-col",true).append("p").text("Change in digital scores of 545 occupations, 2002 to 2016");

	var wrap = outer_wrap.append("div").style("height","70vh");

	

	var compat = degradation(wrap.node());

	var rowFmt = function(row){
		//console.log(Object.keys(row));
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

	var colors = {low:"#0d73d6", medium:"#66c2a5", high:"#ffd92f"};
	var colors = {low:"#a4c7f2", medium:"#4472c4", high:"#053769"};

	var grouper = function(score, color){
		var v = score;

		if(v < 33){
			var cat = "low";
		}
		else if(v < 66){
			var cat = "medium";
		}
		else{
			var cat = "high";
		}

		return arguments.length > 1 && !!color ? colors[cat] : cat; 
	}

	if(compat.browser()){
		d3.csv(dir.url("data", "ForAlec.csv"), rowFmt, function(err, data){

			if(err){
				compat.alert(wrap.node());
			}
			else{

				console.log(dimensions());

				//set up
				data.sort(function(a,b){return a.score16 - b.score16});
				
				var range = d3.extent(data, function(d){return d.score16-d.score02});
				var x = d3.scaleLinear().domain(range).range([10,90]);
				var y = d3.scaleLinear().domain(d3.extent(data, function(d){return d.score16})).range([98, 5]);
				var r = d3.scaleSqrt().domain(d3.extent(data, function(d){return d.emp16})).range([0,25]);
				var x0 = x(0)+"%";

				var svg = wrap.append("svg").attr("width","100%").attr("height","100%");

				var xaxg = svg.append("g");

				var xaxis = d3.axisTop(x);

				xaxis(xaxg);

				//var textr = svg.append("text").attr("x",x0).attr("dx",15).attr("y","20").attr("text-anchor","start").text("Increase since 2002 →").style("font-size","13px");
				//var textl = svg.append("text").attr("x",x0).attr("dx",-15).attr("y","20").attr("text-anchor","end").text("← Decrease since 2002").style("font-size","13px");

				var yaxis = svg.append("line").attr("x1",x0).attr("x2",x0).attr("y1","0%").attr("y2","100%").attr("stroke","#aaaaaa").style("shape-rendering","crispEdges");

				//transform data to include transormed coords for circles
				var dot_data = data.map(function(d,i){
					return {i:i, x:x(d.score16-d.score02)+"%", y:y(d.score16)+"%", r:r(d.emp16), score:d.score16, col: grouper(d.score16, true)};
				});

				//paths
				/*var paths_u = svg.selectAll("line.change").data(dot_data);
				paths_u.exit().remove();
				var paths = paths_u.enter().append("line").classed("change", true).merge(paths_u)
								   .attr("x1",x0).attr("x2",x0)
								   .attr("y1",function(d){return d.y})
								   .attr("y2",function(d){return d.y})
								   ;

					paths.attr("stroke", function(d){return d.col})
						 .attr("stroke-width", function(d){return d.r*1.5})
						 .style("opacity","0.15")
						 ;*/


				//dots
				var dots_u = svg.selectAll("circle.occ").data(dot_data);
					dots_u.exit().remove();
				var dots = dots_u.enter().append("circle").classed("occ",true)
								.merge(dots_u)
								.attr("cx", function(d){return x0})
								.attr("cy", function(d){return d.y})
								.attr("r", function(d, i){return d.r})
								.attr("fill", function(d, i){return d.col})
								.attr("stroke-width","0.5px")
								.attr("stroke", function(d){
									//return d3.color(d.col).darker(0.25);
									return "#ffffff";
								})


				var occ_gu = svg.selectAll("g").data(data);
					occ_gu.exit().remove();
				var occ_ge = occ_gu.enter().append("g")
				var occ_g = occ_ge.merge(occ_gu);


				

				var num_dots = data.length;

				//data is bound to dots in setup

				//duration is dot animation duration... text takes as long as it takes to show... you can add a pause after text

				var sceneDat = [
					{
						text:"Animate first group and describe change in digitalization of high digital skill occupations",
						//accessor: function(d){
						//	return grouper(d.score) === "high" ? d.x : 0;
						//},
						duration:700,
						pause:1500,
						concurrent:false,
						filter:function(d){
							return grouper(d.score) === "high";
						}
					},
					{
						text:"Animate second group. What's going on here... Note that bubble size is employment in 2016.",
						//accessor: function(d){
						//	return grouper(d.score) in {"high":1, "medium":1} ? d.x : 0;
						//},
						duration:700,
						pause:1500,
						concurrent:false,
						filter:function(d){
							return grouper(d.score)=== "medium";
						}
					},
					{
						text:"Animate third group. What's going on here... Explain some summary stats for group.",
						//accessor: function(d){
						//	return d.x;
						//},
						duration:700,
						pause:1500,
						concurrent:false,
						filter:function(d){
							return grouper(d.score)==="low";
						}
					}
				]

				function scenes(sceneData, setupFn){
					var s = -1;

					//fill placeholder with longest text to fix enough space and prevent vertical shifting of graphic during presentation
					var longest_text = sceneData.map(function(d){
						return d.text;
					}).sort(function(a,b){
						return b.length-a.length
					})[0];

					invisible_text.text(longest_text);

					//get and display data for the next "scene"/slide
					function show(){
						console.log("show");

						var data = ++s < sceneData.length ? sceneData[s] : null;

						if(data!==null){

							var text_array = data.text.split("");
							
							//for this slide, have dots/text finished animating?
							var text_finished = false;
							var dots_finished = false;

							var pause = !!data.pause ? data.pause : 0; //how long to wait before next view
							var duration = !!data.duration ? data.duration : 1500; //how long to animate dots
							var concurrent = !!data.concurrent ? data.concurrent : false; //animate dots at same time as text -- not working now

							//accessor for x-position
							/*if(typeof data.accessor === "function"){
								var accessor = data.accessor;
							}
							else if(data.hasOwnProperty("accessor")){
								var accessor = function(d){return data.accessor};
							}
							else{
								var accessor = function(d){
									return d.x;
								}
							}*/

							//run next slide
							var next = function(){
								console.log(text_finished);
								console.log(dots_finished);
								if(text_finished && dots_finished && s < sceneData.length-1){
									//show the next slide after pause duration
									setTimeout(show, pause);
								}
							}

							textpan.selectAll("span").remove();	

							var spans_u = textpan.selectAll("span").data(text_array);
							spans_u.exit().remove();
							var spans = spans_u.enter().append("span").merge(spans_u).style("opacity","0").text(function(txt){return txt});

							spans.transition()
							.delay(function(d,i){
								return i*16;
							}).duration(100)
							.style("opacity","1")
							.on("end", function(d,i){
								if(i==(text_array.length-1)){
									text_finished = true;
									next();
									animate_dots();
								}
							})
							;

							/*var t = -1;
							var tim;
							function timback(elapsed){
								if(++t < text_array.length){
									//var letter = text_array[t];
									//textpan.append("span").text(letter).style("opacity","0").transition().duration(100).style("opacity","1");
									spans.filter(function(d,i){})
									tim.restart(timback, 10);
								}
								else{
									tim.stop();
								}
							}
							tim = d3.timer(timback, 20);*/

							/*var spans = textpan.selectAll("span").data(text_array);
							spans.enter().append("span").style("opacity","0")
										.text(function(d){
											return d=="|" ? " " : d;
										})
										.transition()
										.delay(function(d,i){
											return (i*15);
										})
										.duration(15)
										.style("opacity","1")
										.on("end", function(d,i){
											if(i==(text_array.length-1)){
												text_finished = true;
												animate_dots();
												next();
											}
										})*/

							function animate_dots(){

								var animate = true;
								
								if(typeof data.filter==="function"){
									var sub = dots.filter(data.filter);
									//var psub = paths.filter(data.filter);
								}
								else if(!!data.filter){
									var sub = dots;
									//var psub = paths;
								}
								else{
									//passing a falsy data value for filter will prevent any animation from occurring
									var animate = false;
								}

								if(animate){
									var sub_length = sub.size();
									//var psub_length = psub.size();

									var count = 0;

									sub.transition()
										.delay(function(d,i){return (sub_length - i)})
										.duration(duration)
										.attr("cx", function(d){return d.x})
										.on("end", function(d,i){
											if(sub_length === (++count) ){
												dots_finished = true;
												next();
											}
										})
										;

									/*psub.transition()
										.delay(function(d,i){return (psub_length - i)})
										.duration(duration)
										.attr("x2", function(d,i){
											return d.x;
										});*/
								}
								else{
									dots_finished = true;
									next();
								}
							};

						} //case: data not null
					}

					return show;
				}

				var slideshow = scenes(sceneDat);

				waypoint(wrap.node()).activate(function(){
					slideshow();
				}).buffer(-0.05, 0.65);	

				

			}

		}); //end d3.csv callback


	}
}

	

