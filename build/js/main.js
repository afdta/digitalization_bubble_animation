import dir from "../../../js-modules/rackspace.js";
import degradation from "../../../js-modules/degradation.js";

import bubble_graphic from './bubble_graphic.js';
import opening from './opening.js';
import add_link_icon from './add_link_icon.js';

import metro_map from './metro_water_map.js';

//main function
function main(){


  //local
  dir.local("./");
  dir.add("data", "build/data/initial_handoff/sifan");
  dir.add("assets", "assets");
  //dir.add("dirAlias", "path/to/dir");

  add_link_icon();

  //production data
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");
  //dir.add("dirAlias", "rackspace-slug/path/to/dir");
  var compat = degradation(document.getElementById("metro-interactive"));

  var wrap = d3.select("#metro-interactive");

  //browser degradation
  if(compat.browser()){
  
    opening(document.getElementById("opening-animation"));
    
    bubble_graphic();

    metro_map(document.getElementById("metro-map"));
  }


} //close main()


document.addEventListener("DOMContentLoaded", main);
