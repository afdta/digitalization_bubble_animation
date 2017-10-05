import degradation from "../../../js-modules/degradation.js";
import dir from "../../../js-modules/rackspace.js";

export default function bubble_graphic(){
	var wrap = d3.select("#metro-interactive").append("div").style("width","100%").style("height","90vh");
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

	if(compat.browser()){
		d3.csv(dir.url("data", "ForAlec.csv"), rowFmt, function(err, data){

			if(err){
				compat.alert(wrap.node());
			}
			else{
				wrap.selectAll("p").data(Object.keys(data[0])).enter().append("p").
					text(function(d){return d + ": "+ data[0][d]});
			}

		})
	}

	
}

