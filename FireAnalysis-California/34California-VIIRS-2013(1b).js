/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = /* color: #acc235 */ee.Geometry.Polygon(
        [[[-122.03757135752642, 40.231519880601745],
          [-122.03757135752642, 39.49365087730002],
          [-121.16965143565142, 39.49365087730002],
          [-121.16965143565142, 40.231519880601745]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/


//Import images for 2013.
var collection = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG")
  .filterDate("2013-01-01","2014-01-01") // for 2018 (until the week before the fire started)
  .filterBounds(Paradise); //around the Town of Paradise, California, USA

var viirs = collection.median(); //lighting composite, taking median values

//Center Map
Map.setCenter(-121.619, 39.894, 10);

//Display Layers on the Map with limited range of values.
//Brightest value in Town of Paradise during Camp Fire (~10) is max.
//Minimum is set to 1 to eliminate street lighting.
var single = viirs.select("avg_rad");
Map.addLayer(single,{bands:["avg_rad"],min:1,max:10, palette: ["black", "orange", "white"]},"average masked nightmap", 1, 0.9);

//VIIRS Image Export
Export.image.toDrive({
  image: single,
  description: "VIIRS_2013_Paradise_BigSquare-1b",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0
});