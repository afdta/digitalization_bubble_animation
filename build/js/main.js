import dir from "../../../js-modules/rackspace.js";
import degradation from "../../../js-modules/degradation.js";

import bubble_graphic from './bubble_graphic.js';
import opening from './opening.js';


//main function
function main(){


  //local
  dir.local("./");
  dir.add("data", "./build/data/initial_handoff/sifan");
  //dir.add("dirAlias", "path/to/dir");


  //production data
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");
  var compat = degradation(document.getElementById("metro-interactive"));

  var wrap = d3.select("#metro-interactive");

  //browser degradation
  if(compat.browser()){
  
    opening(document.getElementById("opening-animation"));
    //bubble_graphic();
  }


} //close main()


document.addEventListener("DOMContentLoaded", main);
