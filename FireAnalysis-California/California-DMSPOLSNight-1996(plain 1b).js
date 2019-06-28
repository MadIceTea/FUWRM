/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = /* color: #acc235 */ee.Geometry.Polygon(
        [[[-122.03757135752642, 40.231519880601745],
          [-122.03757135752642, 39.49365087730002],
          [-121.16965143565142, 39.49365087730002],
          [-121.16965143565142, 40.231519880601745]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//Import images for 1996.
//Use DMSP-OLS dataset Nighttime lights set.
var collection = ee.ImageCollection("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS")
  .filterDate("1996-01-01","1997-01-01") // for 1996
  .filterBounds(Paradise); //around the Town of Paradise, California, USA
  
var DMSP = collection.median(); //lighting composite, taking median values

//Display Layers on the Map with limited range of values.
//Minimum is set to 1 to eliminate street lighting.
Map.addLayer(DMSP,{bands:["avg_vis", "stable_lights", "cf_cvg"],min:1,max:63}, "median nightmap", 0, 1);
var single = DMSP.select("stable_lights");
Map.addLayer(single,{bands:["stable_lights"],min:1,max:63,palette: ["black", "orange", "white"]},"average cleaned nightmap", 1, 1);

//debug
print(collection);
print(DMSP);
print(single);

//Export Process
var vis = {
  min: 1, 
  max: 10,
  palette: ["black", "orange", "white"],
};

// visualize image using visOpts above
// turning it into 8-bit visible image.
single = single.visualize(vis);

// obtain native scale of avg_rad band
var scale = single.projection().nominalScale().getInfo();

// add an alpha channel as 4th band to mask no data regions
var mask = single.mask().reduce(ee.Reducer.min())
    .multiply(255).toByte();
single = single.addBands(mask);

//DMSP Image Export
Export.image.toDrive({
  image: single,
  description: "DMSPColored_1996_Paradise_BigSquare-1band",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0
});