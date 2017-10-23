import dimensions from '../../../js-modules/dimensions.js';
import waypoint from "../../../js-modules/on-scroll2.js";

export default function opening(container){
	
	var outer_wrap = d3.select(container).style("width","100%").style("max-width","1200px").style("margin","3rem auto")
		.style("border","1px solid #aaaaaa").style("border-width","1px 0px");

	var textpan = outer_wrap.append("div").classed("big-text-scroll col-center",true).append("p").append("p").text(" ")
			.style("min-height","3rem");

	var wrap = outer_wrap.append("div").style("width","100%").style("height","50vh");

	var colors = {low:"#0d73d6", medium:"#66c2a5", high:"#ffd92f"};

	var svg = wrap.append("svg").attr("width","100%").attr("height","100%");

	var bottomG = svg.append("g");
	var group02 = svg.append("svg").attr("width","50%").attr("height","100%");
	var group16 = svg.append("svg").attr("width","50%").attr("height","100%").attr("x","50%");

	var pause_duration = 1000; //use | to add pause
	var circle_radius = 10;
	var pulse_duration = 2500;

	var rscale = d3.scaleSqrt().domain([0,1]).range([0,circle_radius*9]);
	var yscale = d3.scaleLinear().domain([0,0.6]).range([90,10]);

	var dom = {};

		function teaser(){
			var stop_pulse = false;
			var teaser_group = group02.append("g");
			var pulse_group = teaser_group.append("g");
			var marker = teaser_group.append("circle").attr("r",circle_radius).attr("cx","50%").attr("cy",yscale(0.557)+"%").attr("fill", colors.low);
			
			var cu = pulse_group.selectAll("circle").data(d3.range(1,6));
			cu.exit().remove();
			var c = cu.enter().append("circle").style("opacity","0").attr("cx","50%").attr("cy",yscale(0.557)+"%").attr("fill", colors.low).attr("r", circle_radius)
				.merge(cu).attr("r", circle_radius-1).style("opacity","0.75");

				var pulse = function(){

					c.transition()
					.delay(function(d,i){return i*pulse_duration})
					.duration(pulse_duration)
					.attr("r", circle_radius*4).style("opacity","0")
					.on("end", function(d,i){
						d3.select(this).attr("r", circle_radius-1).style("opacity","1");

						if(i==4 && !stop_pulse){
							pulse();
						}
					});
				}
				pulse();

			var stop = function(){
				stop_pulse = true;
				c.interrupt();
				teaser_group.remove();
			}

			return stop;
		}

		var stop_teaser = teaser();	

	function scene1(nextSceneDelay){
		stop_teaser();
		var text = "Of the occupations we track,|56% required low digital skills in 2002.";
		var text_array = text.split("");
		var value = 0.557;
		var color = "low";
		var nextScene = scene2;
		var sceneDelay = arguments.length ? nextSceneDelay : 3000;

		dom.low_group = group02.append("g");

		var pulse_group = dom.low_group.append("g");
		var marker = dom.low_group.append("circle").attr("r",circle_radius).attr("cx","50%").attr("cy",yscale(value)+"%").attr("fill", colors.low);

		function pulse(){
			var c = pulse_group.selectAll("circle").data(d3.range(1,6));
			c.exit().remove();
			c.enter().append("circle").style("opacity","0").attr("cx","50%").attr("cy",yscale(value)+"%").attr("fill", colors.low).attr("r", circle_radius)
				.merge(c).attr("r", circle_radius-1).style("opacity","0.75")
					.transition()
					.delay(function(d,i){return i*pulse_duration})
					.duration(pulse_duration)
					.attr("r", rscale(value)).style("opacity","0")
					.on("end", function(d,i){
						if(i==4){
							pulse();
						}
					});
		}

		pulse();


		textpan.selectAll("span").remove();		
		var spans = textpan.selectAll("span").data(text_array);
		spans.enter().append("span").style("opacity","0")
					.text(function(d){
						return d=="|" ? " " : d;
					})
					.transition()
					.delay(function(d,i){
						return (i*25);
					})
					.duration(100)
					.style("opacity","1")
					.on("end", function(d,i){
						if(i==(text_array.length-1) && typeof nextScene==="function"){
							setTimeout(nextScene, sceneDelay);
						}
					})
	}

	function scene2(nextSceneDelay){
		var text = "Meanwhile, nearly 40 percent required medium digital skills.";
		var text_array = text.split("");
		var value = 0.395;
		var color = "medium";
		var nextScene = scene3;
		var sceneDelay = arguments.length ? nextSceneDelay : 3000;

		dom.mid_group = group02.append("g");

		var pulse_group = dom.mid_group.append("g");
		var marker = dom.mid_group.append("circle").attr("r",circle_radius).attr("cx","50%").attr("cy",yscale(value)+"%").attr("fill", colors[color]);

		function pulse(){
			var c = pulse_group.selectAll("circle").data(d3.range(1,6));
			c.exit().remove();
			c.enter().append("circle").style("opacity","0").attr("cx","50%").attr("cy",yscale(value)+"%").attr("fill", colors[color]).attr("r", circle_radius)
				.merge(c).attr("r", circle_radius-1).style("opacity","0.75")
					.transition()
					.delay(function(d,i){return i*pulse_duration})
					.duration(pulse_duration)
					.attr("r", rscale(value)).style("opacity","0")
					.on("end", function(d,i){
						if(i==4){
							pulse();
						}
					});
		}

		pulse();


		textpan.selectAll("span").remove();		
		var spans = textpan.selectAll("span").data(text_array);
		spans.enter().append("span").style("opacity","0")
					.text(function(d){
						return d=="|" ? " " : d;
					})
					.transition()
					.delay(function(d,i){
						return (i*25);
					})
					.duration(100)
					.style("opacity","1")
					.on("end", function(d,i){
						if(i==(text_array.length-1) && typeof nextScene==="function"){
							setTimeout(nextScene, sceneDelay);
						}
					})
					;
	}

	function scene3(nextSceneDelay){
		var text = "And just 5 percent required high digital skills.";
		var text_array = text.split("");
		var value = 0.048;
		var color = "high";
		var nextScene = scene4;
		var sceneDelay = arguments.length ? nextSceneDelay : 3000;

		dom.mid_group = group02.append("g");

		var pulse_group = dom.mid_group.append("g");
		var marker = dom.mid_group.append("circle").attr("r",circle_radius).attr("cx","50%").attr("cy",yscale(value)+"%").attr("fill", colors[color]);

		function pulse(){
			var c = pulse_group.selectAll("circle").data(d3.range(1,6));
			c.exit().remove();
			c.enter().append("circle").style("opacity","0").attr("cx","50%").attr("cy",yscale(value)+"%").attr("fill", colors[color]).attr("r", circle_radius)
				.merge(c).attr("r", circle_radius-1).style("opacity","0.75")
					.transition()
					.delay(function(d,i){return i*pulse_duration})
					.duration(pulse_duration)
					.attr("r", rscale(value)).style("opacity","0")
					.on("end", function(d,i){
						if(i==4){
							pulse();
						}
					});
		}

		pulse();


		textpan.selectAll("span").remove();		
		var spans = textpan.selectAll("span").data(text_array);
		spans.enter().append("span").style("opacity","0")
					.text(function(d){
						return d=="|" ? " " : d;
					})
					.transition()
					.delay(function(d,i){
						return (i*25);
					})
					.duration(100)
					.style("opacity","1")
					.on("end", function(d,i){
						if(i==(text_array.length-1) && typeof nextScene==="function"){
							setTimeout(nextScene, sceneDelay)
						}
					})
					;
	}

	function scene4(nextSceneDelay){
		var text = "But by 2016, the share of jobs requiring high digital skills had jumped to 23%.";
		var text_array = text.split("");
		var value = 0.230;
		var color = "high";
		var nextScene = scene5;
		var sceneDelay = arguments.length ? nextSceneDelay : 3000;

		dom.mid_group = group16.append("g");

		textpan.selectAll("span").remove();		
		var spans = textpan.selectAll("span").data(text_array);
		spans.enter().append("span").style("opacity","0")
					.text(function(d){
						return d=="|" ? " " : d;
					})
					.transition()
					.delay(function(d,i){
						return (i*25);
					})
					.duration(100)
					.style("opacity","1")
					.on("end", function(d,i){
						if(i==(text_array.length-1)){
							goToNext();
						}
					})
					;


		var firstRun = true;
		var pulse_group;
		var marker;
		function pulse(){
			if(firstRun){
				pulse_group = dom.mid_group.append("g");
				marker = dom.mid_group.append("circle").attr("r",circle_radius).attr("cx","50%").attr("cy",yscale(value)+"%").attr("fill", colors[color]);
				firstRun = false;
			}
			var c = pulse_group.selectAll("circle").data(d3.range(1,6));
			c.exit().remove();
			c.enter().append("circle").style("opacity","0").attr("cx","50%").attr("cy",yscale(value)+"%").attr("fill", colors[color]).attr("r", circle_radius)
				.merge(c).attr("r", circle_radius-1).style("opacity","0.75")
					.transition()
					.delay(function(d,i){return i*pulse_duration})
					.duration(pulse_duration)
					.attr("r", rscale(value)).style("opacity","0")
					.on("end", function(d,i){
						if(i==4){
							pulse();
						}
					});
		}

		function goToNext(){
			var start = [25, yscale(0.048)];
			var finish = [75, yscale(value)];
			var line = bottomG.append("line").attr("stroke", colors[color])
											 .attr("stroke-width","3")
											 .attr("x1","25%")
											 .attr("x2","25%")
											 .attr("y1",start[1]+"%")
											 .attr("y2",start[1]+"%")
											 .transition().duration(1000)
											 .attr("x2",finish[0]+"%")
											 .attr("y2",finish[1]+"%")
											 .on("end", function(){
											 	pulse();
											 	if(typeof nextScene==="function"){
											 		setTimeout(nextScene, sceneDelay);	
											 	}
											 });											 
		}

	}


	function scene5(nextSceneDelay){
		var text = "The share of jobs requiring medium digital skills rose to 48 percent.";
		var text_array = text.split("");
		var value = 0.475;
		var color = "medium";
		var nextScene = scene6;
		var sceneDelay = arguments.length ? nextSceneDelay : 3000;

		dom.mid_group = group16.append("g");

		textpan.selectAll("span").remove();		
		var spans = textpan.selectAll("span").data(text_array);
		spans.enter().append("span").style("opacity","0")
					.text(function(d){
						return d=="|" ? " " : d;
					})
					.transition()
					.delay(function(d,i){
						return (i*25);
					})
					.duration(100)
					.style("opacity","1")
					.on("end", function(d,i){
						if(i==(text_array.length-1)){
							goToNext();
						}
					})
					;


		var firstRun = true;
		var pulse_group;
		var marker;
		function pulse(){
			if(firstRun){
				pulse_group = dom.mid_group.append("g");
				marker = dom.mid_group.append("circle").attr("r",circle_radius).attr("cx","50%").attr("cy",yscale(value)+"%").attr("fill", colors[color]);
				firstRun = false;
			}
			var c = pulse_group.selectAll("circle").data(d3.range(1,6));
			c.exit().remove();
			c.enter().append("circle").style("opacity","0").attr("cx","50%").attr("cy",yscale(value)+"%").attr("fill", colors[color]).attr("r", circle_radius)
				.merge(c).attr("r", circle_radius-1).style("opacity","0.75")
					.transition()
					.delay(function(d,i){return i*pulse_duration})
					.duration(pulse_duration)
					.attr("r", rscale(value)).style("opacity","0")
					.on("end", function(d,i){
						if(i==4){
							pulse();
						}
					});
		}

		function goToNext(){
			var start = [25, yscale(0.395)];
			var finish = [75, yscale(value)];
			var line = bottomG.append("line").attr("stroke", colors[color])
											 .attr("stroke-width","3")
											 .attr("x1","25%")
											 .attr("x2","25%")
											 .attr("y1",start[1]+"%")
											 .attr("y2",start[1]+"%")
											 .transition().duration(1000)
											 .attr("x2",finish[0]+"%")
											 .attr("y2",finish[1]+"%")
											 .on("end", function(){
											 	pulse();
											 	if(typeof nextScene==="function"){
											 		setTimeout(nextScene, sceneDelay);	
											 	}
											 });											 
		}

	}

	function scene6(nextSceneDelay){
		var text = "And in a huge shift, the share of jobs requiring low digital skills fell from 56 to 30 percent.";
		var text_array = text.split("");
		var value = 0.295;
		var color = "low";
		var nextScene = null;
		var sceneDelay = arguments.length ? nextSceneDelay : 3000;

		dom.mid_group = group16.append("g");

		textpan.selectAll("span").remove();		
		var spans = textpan.selectAll("span").data(text_array);
		spans.enter().append("span").style("opacity","0")
					.text(function(d){
						return d=="|" ? " " : d;
					})
					.transition()
					.delay(function(d,i){
						return (i*25);
					})
					.duration(100)
					.style("opacity","1")
					.on("end", function(d,i){
						if(i==(text_array.length-1)){
							goToNext();
						}
					})
					;


		var firstRun = true;
		var pulse_group;
		var marker;
		function pulse(){
			if(firstRun){
				pulse_group = dom.mid_group.append("g");
				marker = dom.mid_group.append("circle").attr("r",circle_radius).attr("cx","50%").attr("cy",yscale(value)+"%").attr("fill", colors[color]);
				firstRun = false;
			}
			var c = pulse_group.selectAll("circle").data(d3.range(1,6));
			c.exit().remove();
			c.enter().append("circle").style("opacity","0").attr("cx","50%").attr("cy",yscale(value)+"%").attr("fill", colors[color]).attr("r", circle_radius)
				.merge(c).attr("r", circle_radius-1).style("opacity","0.75")
					.transition()
					.delay(function(d,i){return i*pulse_duration})
					.duration(pulse_duration)
					.attr("r", rscale(value)).style("opacity","0")
					.on("end", function(d,i){
						if(i==4){
							pulse();
						}
					});
		}

		function goToNext(){
			var start = [25, yscale(0.557)];
			var finish = [75, yscale(value)];
			var line = bottomG.append("line").attr("stroke", colors[color])
											 .attr("stroke-width","3")
											 .attr("x1","25%")
											 .attr("x2","25%")
											 .attr("y1",start[1]+"%")
											 .attr("y2",start[1]+"%")
											 .transition().duration(1000)
											 .attr("x2",finish[0]+"%")
											 .attr("y2",finish[1]+"%")
											 .on("end", function(){
											 	pulse();
											 	if(typeof nextScene==="function"){
											 		setTimeout(nextScene, sceneDelay);	
											 	}
											 });											 
		}

	}

	waypoint(container).activate(function(){
		scene1();
	}).buffer(-0.05, 0.65);	

}