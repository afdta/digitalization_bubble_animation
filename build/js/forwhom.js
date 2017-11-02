//import add_hand_icons from './add_hand_icons.js';

export default function forwhom(){
	var I = {};

	//lists of policy ids
	var local = ["automation", "jobgr", "wages", "wagegr", "gender", "race"];
	
	//policy text -- paragraphs separated by {p}
	var policy = {};

	//footnotes in same order as s in the text
	var footnotes = {};

	////split by footnotes first, then by paragraphs so, do {p} not the reverse

	//local
	policy.automation = 'Nearly 60 percent of tasks performed in low-digital occupations appear susceptible to automation, compared to only around 30 percent of tasks in highly digital occupations.{p}Read more about the correlation between digitalization and automation – pointer icon »';
	footnotes.automation = []

	policy.jobgr = 'Job growth has been rapid in high-digital level occupations, such as computer-mathematical and business-finance occupational groups, as well as in low-digital level occupations, such as personal care and food preparation. By contrast, middle-digital occupations, such as office-administrative and education occupations have seen much slower job growth. Read more about the correlation between digitalization and job growth – pointer icon »';
	footnotes.jobgr = [];

	policy.wages = 'The mean annual wage for workers in high-level digital occupations reached $72,896 in 2016, whereas workers in middle-level digital jobs earned $48,274 on average, and workers in low-level digital occupations earned $30,393 on average. Read more about the correlation between digitalization and wages – pointer icon »';
	footnotes.wages = [];

	//federal
	policy.wagegr = 'Between 2010 and 2016, occupations with high-level digital scores on average registered more than 0.8 percent wage growth annually, compared to middle-level annual wage growth of 0.3 percent, versus annual wage declines of 0.2 percent for low-level occupations. Read more about the correlation between digitalization and wage growth – pointer icon »';
	footnotes.wagegr = [];

	policy.gender = 'Women (48), with slightly higher aggregate digital scores than men (45), represent about three-quarters of the workforce in many of the largest medium-digital occupational groups, such as health care, office administration, and education. Conversely, men continue to dominate the highest-level digital occupations, such as computer, engineering and management fields, as well as lower-digital occupations such as transportation, construction, natural resources, and building and grounds occupations. Read more about the correlation between digitalization and gender – pointer icon »';
	footnotes.gender = [];

	policy.race = 'Whites (65 percent of the workforce) remain overrepresented in high-level digital occupational groups, such as engineering and management, as well as medium-level digital areas such as business and finance, the arts, and legal and education professions. Asians (6 percent of the workforce) account for 21.3 percent of highly digital computer and math occupations, and 11.6 percent of engineering occupations. Blacks (12 percent of the workforce) are overrepresented in medium-digital occupations such as office and administrative support, community and social service, as well as low-digital level jobs such as transportation, personal care, and building and grounds maintenance. Hispanics (17 percent of the workforce) are significantly underrepresented in high-level digital technical, business and finance occupational groups, and somewhat underrepresented in medium-level legal, sales, and education positions. Read more about the correlation between digitalization and race/ethnicity – pointer icon »';
	footnotes.race = [];

	//parse
	var policy2 = {};
	for(var p in policy){
		if(policy.hasOwnProperty(p)){
			var split0 = policy[p].split("{f}");

			var footnoted = "";
			split0.forEach(function(d,i){
				//don't footnote the last substring. if last character is footnote, then the last element in the array will be blank string, ""
				var super_note = (i < (split0.length-1)) ? '<sup style="vertical-align:super;">' + (i+1) + '</sup>' : '';
				footnoted = footnoted + d + super_note;
			}); 
			policy2[p] = footnoted.split("{p}");
		}
	}

	var body_wrap = d3.select("#metro-interactive");
	var show = function(id){
		d3.event.stopPropagation();
		var fixed = body_wrap.append("div")
			.style("position","fixed")
			.style("width","100%")
			.style("height","100%")
			.style("z-index","1000")
			.style("background-color","rgba(0, 0, 0, 0)")
			.style("top","0px")
			.style("left","0px")
			.classed("makesans",true)
			;

		var table = fixed.append("div")
			.style("display","table")
			.style("max-width","1000px")
			.style("width","90%")
			.style("height","100%")
			.style("margin","1em auto")
			.style("opacity","0");
		var row = table.append("div")
			.style("display","table-row");
		var cell = row.append("div")
			.style("display","table-cell")
			.style("vertical-align","middle")
			;

		var box_wrap = cell.append("div")
			.style("border","0px solid #ffffff")
			.style("padding","0px")
			.style("position","relative")
			.style("display","block")
			;

		var ribbon_cols = ["#0d73d6"];
		var svg_ribbon = box_wrap.append("div")
								 .style("height","10px")
								 .append("svg").attr("width","100%")
								 .attr("height","100%")
								 .style("x","0px")
								 .style("y","0px")
								.style("display","block")
								.selectAll("rect").data(ribbon_cols).enter()
								.append("rect").attr("width",(100/(ribbon_cols.length))+"%")
								.attr("height","100%").attr("x", function(d,i){return (i*(100/7))+"%"})
								.attr("fill", function(d,i){
									return ribbon_cols[i];
								});


		var x_height = 30;
		var x_width = x_height;

		var xsvg = box_wrap.append("div")
		   .style("cursor","pointer")
		   .classed("make-sans",true)
		   .style("position","absolute")
		   .style("top",(x_width)+"px")
		   .style("right",x_width+"px")
		   .style("width",x_width+"px")
		   .style("height",x_height+"px")
		   .style("z-index","10")
		   .append("svg")
		   .attr("width","100%").attr("height","100%")
		   ;

			xsvg.append("line").attr("x1","20%").attr("x2","80%").attr("y1","20%").attr("y2","80%");
			xsvg.append("line").attr("x1","20%").attr("x2","80%").attr("y1","80%").attr("y2","20%");

			xsvg.selectAll("line").attr("stroke","#0d73d6")
									.attr("stroke-width","5px");
		   ;

		var box = box_wrap.append("div").classed("reading",true)
			.style("background-color","rgba(250, 250, 250, 1)")
			.style("position","relative")
			.style("padding","1rem")
			.style("line-height","1.4em")
			.style("overflow","auto")
			.style("max-height","85vh")
			.style("max-width","1000px")
			.style("z-index","5")
			;


			box.selectAll("p").data(policy2[id]).enter().append("p").classed("brook",true)
						.html(function(d){return d})
						.style("padding",function(d,i){
							return i==0 ? "0.5rem " + (x_width+20)+"px" + " 0rem 1rem" : "0rem 1rem 0rem 1rem";
						})
						.style("margin","1rem 0em 1.75rem 0em")
						.style("font-weight",function(d,i){return i==0 ? "bold" : "normal"})
						.style("font-size",function(d,i){return i==0 ? "1.15em" : null})
						;

		if(footnotes[id].length > 0){
			box.append("div").style("height","0.5em").style("width","30%")
				  .style("border-top","1px solid #aaaaaa")
				  .style("margin","0px 0px 0px 0.75rem");
			var footnote_wrap = box.append("div").style("margin","1rem");
			var footnote_text = footnote_wrap.selectAll("p").data(function(d){return footnotes[id] }).enter().append("p")
											.html(function(d,i){
												var super_note = '<sup style="vertical-align:super;">' + (i+1) + '</sup> ';
												return super_note + d;
											});
		}

		//show
		fixed.transition()
			.style("background-color","rgba(0, 0, 0, 0.75)")
			;
		table.transition().style("opacity","1");		

		box.on("mousedown", function(d,i){
			d3.event.stopPropagation();
		})

		fixed.on("mousedown", function(d,i){
			fixed.remove();
		});
		//
	}//end show


	//use 1: layout all the interventions in a large grid with text
	I.grid = function(container, local_policy){
		var wrap = d3.select(container).style("max-width","1600px").style("margin","0px auto");

		var data = arguments.length > 1 && !!local_policy ? 
					local.map(function(d){return {id:d, text:policy2[d]}}) : 
					federal.map(function(d){return {id:d, text:policy2[d]}}); 

		var row = wrap.selectAll("div").data([data])
							.enter().append("div")
							.classed("c-fix",true)
							.style("margin","0em 0em")
							;

		var tiles = row.selectAll("div.subway-tile").data(function(d){return d})
							.enter().append("div").classed("subway-tile",true);

		var headers = tiles.append("div").classed("tile-header",true);
		var dots = headers.append("div").classed("dot",true);
		//var dot_labels = dots.append("p").text(function(d){return d});


		var content = tiles.append("div").classed("tile-content reading",true);
		var text = content.selectAll("p").data(function(d){return d.text}).enter().append("p")
							.html(function(d){return d})
							.style("font-weight",function(d,i){return i==0 ? "bold" : "normal"})
							.style("font-size",function(d,i){return i==0 ? "1em" : null})
							;
		;

		content.each(function(d,i){
			var thiz = d3.select(this);
			if(footnotes[d.id].length > 0){
				thiz.append("div").style("height","0.5em").style("width","30%")
								  .style("border-top","1px solid #aaaaaa")
								  ;

				var footnote_wrap = thiz.append("div");
				var footnote_text = footnote_wrap.selectAll("p").data(function(d){return footnotes[d.id] }).enter().append("p")
												.html(function(d,i){
													var super_note = "<sup>" + (i+1) + "</sup> ";
													return super_note + d;
												});
			}
		});

		//more info available...

		tiles.append("div").classed("more-info-available",true);

		var expandable = {};
		var sizeCheck = function(){

			content.each(function(d,i){
				var bottom0 = this.parentNode.getBoundingClientRect().bottom;
				var bottom1 = this.getBoundingClientRect().bottom;
				expandable[(i+"")] = bottom1 > bottom0;
			});

			tiles.classed("click-for-more-info", function(d,i){
					if(expandable[(i+"")]){
						return true;
					}
					else{
						return false;
					}				
				});
			
			var uup = tiles.selectAll("div.zoomdiv").data(function(d,i){
				return expandable[(i+"")] ? [1] : [];
			});
			uup.exit().remove();
			var uen = uup.enter().append("div").classed("zoomdiv",true);
				uen.append("svg")
				uen.style("position","absolute")
					  .style("bottom","0em")
					  .style("right","10%")
					  .style("width","50px")
					  .style("height","50px")
					  .style("padding","0px")
					  .style("border","0px solid #0d73d6")
					  .style("background-color","rgba(255,255,255,0.8)")
					  .style("border-radius","25px")
					  ;

				var zoom_svg = uen.select("svg").attr("width","35px")
									    .attr("height","35px")
										.attr("viewBox","0 0 50 50");

				var zoom_in_g = zoom_svg.append("g").attr("transform","translate(0,-1030)")
												.attr("stroke-linecap","round")
												;	

				zoom_in_g.append("path").attr("d","m42.5 1055a17.5 17.5 0 0 1 -17.5 17.5 17.5 17.5 0 0 1 -17.5 -17.5 17.5 17.5 0 0 1 17.5 -17.5 17.5 17.5 0 0 1 17.5 17.5z").attr("fill","#999999").attr("stroke","#555555");
				zoom_in_g.append("path").attr("d","m19 1054.5 6.1902 6 5.8098-6")
										.attr("stroke","#ffffff").attr("stroke-linecap","square").attr("fill","none").attr("stroke-width","5")
										.attr("stroke-linejoin","round");


		}

		tiles.on("mousedown", function(d,i){
			if(expandable[(i+"")]){
				show(d.id);
			}
		});

		sizeCheck();

		window.addEventListener("resize", sizeCheck);


	}

	return I;
}
