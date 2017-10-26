import degradation from "../../../js-modules/degradation.js";
import dir from "../../../js-modules/rackspace.js";
import waypoint from "../../../js-modules/on-scroll2.js";

export default function bubble_graphic(){
	var outer_wrap = d3.select("#bubble-growth").style("width","100%");

	var textpan = outer_wrap.append("div").classed("big-text-scroll col-center",true).style("margin-bottom","1rem").append("p").text(" ")
										.style("min-height","4em");

	var wrap = outer_wrap.append("div").style("height","90vh");
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
	var filler = function(d){
		var v = d.score;
		if(v < 33){
			return colors.low;
		}
		else if(v < 66){
			return colors.medium;
		}
		else{
			return colors.high;
		}
	}

	if(compat.browser()){
		d3.csv(dir.url("data", "ForAlec.csv"), rowFmt, function(err, data){

			if(err){
				compat.alert(wrap.node());
			}
			else{

				//set up
				data.sort(function(a,b){return a.score16 - b.score02});
				
				var range = d3.extent(data, function(d){return d.score16-d.score02});
				var x = d3.scaleLinear().domain(range).range([10,90]);
				var y = d3.scaleLinear().domain(d3.extent(data, function(d){return d.score16})).range([90, 10]);
				var r = d3.scaleSqrt().domain(d3.extent(data, function(d){return d.emp16})).range([0,15]);
				var x0 = x(0)+"%";

				var svg = wrap.append("svg").attr("width","100%").attr("height","100%");

				var textr = svg.append("text").attr("x",x0).attr("dx",10).attr("y","50").attr("text-anchor","start").text("Increase since 2002 →").style("font-size","13px");
				var textl = svg.append("text").attr("x",x0).attr("dx",-10).attr("y","50").attr("text-anchor","end").text("← Decrease since 2002").style("font-size","13px");
				var text = svg.append("text").attr("x",x0).attr("y","15").attr("text-anchor","middle").text("Change in digital scores of 545 occupations, 2002 to 2016");

				var yaxis = svg.append("line").attr("x1",x0).attr("x2",x0).attr("y1","25").attr("y2","95%").attr("stroke","#aaaaaa").style("shape-rendering","crispEdges");

				var paths_u = svg.selectAll("line.change").data(data);
				paths_u.exit().remove();
				var paths = paths_u.enter().append("line").classed("change", true).merge(paths_u)
								   .attr("x1",x0).attr("x2",x0)
								   .attr("y1",function(d){return y(d.score16)+"%"})
								   .attr("y2",function(d){return y(d.score16)+"%"})
								   ;

					paths.attr("stroke", function(d){return filler({score:d.score16})})
						 .attr("stroke-width", function(d){return r(d.emp16)*1.5})
						 .style("opacity","0.25")
						 ;

				var occ_gu = svg.selectAll("g").data(data);
					occ_gu.exit().remove();
				var occ_ge = occ_gu.enter().append("g")
				var occ_g = occ_ge.merge(occ_gu);

				var dots_u = occ_g.selectAll("circle").data(function(d, i){
					var d1 = {i:i, x:x(d.score16-d.score02)+"%", y:y(d.score16)+"%", r:r(d.emp16), score:d.score16};
					var d0 = {i:i, x:x0, y:y(d.score16)+"%", r:r(d.emp16), score:d.score02};
					return [d1];
				});
					dots_u.exit().remove();
				
				var dots = dots_u.enter().append("circle").merge(dots_u)
								.attr("cx", function(d){return x0})
								.attr("cy", function(d){return d.y})
								.attr("r", function(d, i){return d.r})
								.attr("fill", function(d, i){return d3.color(filler(d)).darker(0.5);})
								.attr("stroke", function(d){
									return "#ffffff";
								})

				function intro(){
					var text = "Digitalization scores rose in 517 of 545 analyzed occupations from 2002 to 2016.";
					var text_array = text.split("");

					var nextScene = scene1;

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
										setTimeout(scene1, 1500);
									}
								})
					
					
					//var line = svg.append("line").attr("x1",x0).attr("x2",x0).attr("y1",y).attr("y2",y).attr("stroke","#666666").style("shape-rendering","crispEdges");
					//var dot = svg.append("circle").attr("cx",x0).attr("cy",y).attr("r","5").attr("fill","#ffffff").attr("stroke","#666666");
					//var text = svg.append("text").attr("x",x0).attr("y","15").attr("text-anchor","middle").text("2002 score = 0");	

					//← Change in digital score, 2002 to 2016 →"
					
				}

				//run animation
				function scene1(){

					var text = "Animate first group and describe change in digitalization of high digital skill occupations";
					var text_array = text.split("");

					var nextScene = scene2;

					var textDone = false;

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
								.on("end", function(d, i){
									if(i==(text_array.length-1)){
										textDone = true;
									}
								})
								;

					dots.transition()
						.delay(function(d,i){return 10*(data.length - d.i)})
						.duration(2000)
						.attr("cx", function(d){return d.x})
						.on("end", function(d,i){
							if(d.i > 100 && typeof nextScene==="function" && textDone){
								textDone = false;
								setTimeout(nextScene, 1500);
							}
						})
						;

					paths.transition()
						.delay(function(d,i){return 10*(data.length - i)})
						.duration(2000)
						.attr("x2", function(d,i){
							return x(d.score16-d.score02)+"%";
						})
				}

				//run animation
				function scene2(){

					var text = "Animate second group. What's going on here... Note that bubble size is employment in 2016.";
					var text_array = text.split("");

					var nextScene = scene3;

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
										setTimeout(nextScene, 1500);
									}
								})
				}

				//run animation
				function scene3(){

					var text = "After it's over, allow user to interact with plot to get more detail.";
					var text_array = text.split("");

					var nextScene = null;

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
										setTimeout(nextScene, 1500);
									}
								})
				}


				waypoint(wrap.node()).activate(function(){
					intro();
				}).buffer(-0.05, 0.65);	

			}

		});


	}

	
}

