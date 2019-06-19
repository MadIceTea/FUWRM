/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = /* color: #acc235 */ee.Geometry.Polygon(
        [[[-122.03757135752642, 40.231519880601745],
          [-122.03757135752642, 39.49365087730002],
          [-121.16965143565142, 39.49365087730002],
          [-121.16965143565142, 40.231519880601745]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//Import images for 1998, around a decade before the Camp Fire.
//Use DMSP-OLS dataset Nighttime lights set.
var collection = ee.ImageCollection("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS")
  .filterDate("1998-01-01","1999-01-01") // for 1998
  .filterBounds(Paradise); //around the Town of Paradise, California, USA
  
var DMSP = collection.median(); //lighting composite, taking median values

//Center Map
Map.setCenter(-121.619, 39.894, 10);

//Display Layers on the Map with limited range of values.
//Minimum is set to 1 to eliminate street lighting.
Map.addLayer(DMSP,{bands:["avg_vis", "stable_lights", "cf_cvg"],min:0,max:63}, "median nightmap", 0, 1);
var single = DMSP.select("stable_lights");
Map.addLayer(single,{bands:["stable_lights"],min:0,max:63,palette: ["black", "orange", "white"]},"average cleaned nightmap", 1, 1);

//DMSP Image Export
Export.image.toDrive({
  image: single,
  description: "DMSPColored_1998_Paradise_BigSquare-1band",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
});