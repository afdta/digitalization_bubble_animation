import dimensions from '../../../js-modules/dimensions.js';
import waypoint from "../../../js-modules/on-scroll2.js";
import scope from "../../../js-modules/scope.js";

//to do: put longest text string in title box -- set visibility to hidden on it and all other titles get put in absolutely positioned box on top

export default function opening(container){

	//padding to allow for axes
	var padding = scope("padding");

	//space between plot" data and axes
	var plotpad = scope("plotpad");

	//dom setup
	var outer_wrap = d3.select(container).style("width","100%")
										 .style("margin","4rem 0rem 0rem 0rem")
										 .style("padding","2rem 0rem")
										 .style("border","1px solid #aaaaaa")
										 .style("border-width","1px 0px")
										 .classed("c-fix",true)
										 ;

	var plot_wrap = outer_wrap.append("div").style("margin","0px").classed("plot-wrap",true);

	var text_box = plot_wrap.append("div").classed("col-left",true);

	var title = text_box.append("p").text("The U.S. economy is digitalizing at an extremely rapid pace.").classed("chart-title",true);
	var subtitle = text_box.append("p").html('Between 2002 and 2016, the shares of U.S. jobs that require substantial digital knowledge rose rapidly, whether because of changes in the digital content of existing occupations or due to shifts in the distribution of occupations. <a>[LINK OUT]</a>').classed("chart-subtitle",true);

	var wrap = plot_wrap.append("div").style("width","100%").style("height","50vh");

	var colors = {low:"#a4c7f2", medium:"#4472c4", high:"#053769"};

	var svg = wrap.append("svg").attr("width","100%").attr("height","100%");

	function draw(){
		var dims = dimensions();

		var width = dims.viewport.width * 0.95;
		var height = dims.viewport.height * 0.5;

		if(height < 400){height = 400}
		if(width < 320){width = 320}

		plot_wrap.style("width", width+"px");
		wrap.style("height", height+"px");			
	}

	draw();

	window.addEventListener("resize", draw);
}