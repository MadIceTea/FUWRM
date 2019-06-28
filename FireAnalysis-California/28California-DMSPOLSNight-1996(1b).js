/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = /* color: #acc235 */ee.Geometry.Polygon(
        [[[-122.03757135752642, 40.231519880601745],
          [-122.03757135752642, 39.49365087730002],
          [-121.16965143565142, 39.49365087730002],
          [-121.16965143565142, 40.231519880601745]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Import the primary region of interest, Town of Paradise which burned in the Camp Fire of 2018.
var Paradise = ee.FeatureCollection("ft:1JIO1SLcMe08lHJWUIP7zWpW5razN6FfIwibHtcje").geometry();

//Also import the small town region of Magalia to the north, and the larger city of Chico to the west.
var Magalia = ee.FeatureCollection("ft:1BCMRnYS4plV2NVWtP6dZHYmE1V00kY8baAPU9Udm").geometry();
var Chico = ee.FeatureCollection("ft:1mmRj4fN8mmvtynTxG56XMZJ-1y9n1i-lDUCIsXwV").geometry();

// show the layers
Map.addLayer(Paradise, {color: "280AC2"}, "Town of Paradise, California", 1, 1); //deep purple
Map.addLayer(Magalia, {color: "91184E"}, "Town of Magalia, California", 1, 1); //reddish-purple
Map.addLayer(Chico, {color: "1C06C2"}, "City of Chico, California", 1, 1); //deep blue

//Center Map
Map.centerObject(Paradise, 10);

//Import images for 1996.
//Use DMSP-OLS dataset Nighttime lights set.
var collection = ee.ImageCollection("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS")
  .filterDate("1996-01-01","1997-01-01") // for 1996
  .filterBounds(Paradise); //around the Town of Paradise, California, USA
  
var DMSP = collection.median(); //lighting composite, taking median values

//Display Layers on the Map with limited range of values.
Map.addLayer(DMSP,{bands:["avg_vis", "stable_lights", "cf_cvg"],min:0,max:63}, "median nightmap", 0, 1);
var single = DMSP.select("stable_lights");
Map.addLayer(single,{bands:["stable_lights"],min:0,max:63,palette: ["black", "orange", "white"]},"average cleaned nightmap", 1, 1);

//DMSP Image Export
Export.image.toDrive({
  image: single,
  description: "DMSPColored_1996_Paradise_BigSquare-1b",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0
});