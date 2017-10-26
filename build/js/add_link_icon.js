import dir from '../../../js-modules/rackspace.js';

export default function add_link_icon(container){
	if(arguments.length > 0){
		var spans = d3.select(container).selectAll('span.link-icon');
	}
	else{
		var spans = d3.selectAll('span.link-icon');
	}

	var url = dir.url("assets", "Icons_link.png");

	var images = spans.selectAll("img").data([url]);
		images.exit().remove();
		images.enter().append("img").style("display","inline-block")
									.style("width","2em")
									.style("height","2em")
									.style("vertical-align","middle")
									.attr("src", url)
									.attr("alt","pointer icon");
}