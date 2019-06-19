/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = /* color: #acc235 */ee.Geometry.Polygon(
        [[[-122.03757135752642, 40.231519880601745],
          [-122.03757135752642, 39.49365087730002],
          [-121.16965143565142, 39.49365087730002],
          [-121.16965143565142, 40.231519880601745]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//Import images for 2008, around a decade before the Camp Fire.
//Use DMSP-OLS dataset Nighttime lights set.
var collection = ee.ImageCollection("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS")
  .filterDate("2008-01-01","2009-01-01"); // for 2008

var DMSP = collection.median(); //lighting composite, taking median values

//Center Map
Map.setCenter(-121.619, 39.894, 10);

//Display Layers on the Map with limited range of values.
//Brightest value in Town of Paradise during Camp Fire (~10) is max.
//Minimum is set to 1 to eliminate street lighting.
Map.addLayer(DMSP,{bands:["avg_vis", "stable_lights", "cf_cvg"],min:0,max:60}, "median nightmap", 0, 1);
var single = DMSP.select("stable_lights");
Map.addLayer(single,{bands:["stable_lights"],min:0,max:60,palette: ["black", "orange", "white"]},"average cleaned nightmap", 1, 1);

//DMSP Image Export
Export.image.toDrive({
  image: single,
  description: "DMSPColored_2008_Paradise_BigSquare-1band",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
});