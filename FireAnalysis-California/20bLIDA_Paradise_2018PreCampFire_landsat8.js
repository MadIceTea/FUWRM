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

//L8SR Bands and Human-Friendly Naming
var LANDSAT_8_BANDS = ["B2","B3","B4","B5","B6","B10","B7"];
var STD_NAMES = ["blue","green","red","nir","swir1","tir","swir2"];

//Filtering against Paradise at near one-year resolution, previous the Camp Fire.
//There will be no modeling for during the Camp Fire.
var landsat_SR = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR") //load LANDSAT8 raws
	.filterBounds(Paradise)
	.filterDate("2018-01-01","2018-11-01")
	// Filter cloudy scenes.
  .filter(ee.Filter.lt("CLOUD_COVER", 35))
	.select(LANDSAT_8_BANDS, STD_NAMES);

print(landsat_SR); //date debug

var median = landsat_SR.median();

//Display the Composite
Map.addLayer(landsat_SR, {"bands":["red","green","blue"],min:0,max:2000}, "baselayer", 0, 1);

function addNDVI(image) {
  return image
    .addBands(image.normalizedDifference(["nir","red"]).rename("ndvi"))
  ;
}

var ndvi = addNDVI(median);

Map.addLayer(ndvi,{bands:["ndvi"],min:0,max:1}, "ndvilayer", 0, 1);

//predict bands
var predictionBands = ["blue","green","red","nir","swir1","swir2","ndvi"];

var trainingimage = ndvi.select(predictionBands);

//fusion-table of polygons drawn in Google Earth Desktop
var trainingpolygons = ee.FeatureCollection("ft:1DEQC9tLdjoERve9NKtLizNd19_eaoyk-Jslwogc-");

var training = trainingimage.sampleRegions({
    collection: trainingpolygons,
    properties: ["class"],
    scale: 30
});

//Train the CART classifier (a regular expression, not made up) with default parameters
var trained = ee.Classifier.cart().train(training,"class", predictionBands);

//Classify image with the same bands used for training.
var CARTclassified = trainingimage.select(predictionBands).classify(trained);

//Display the result using 0=barren, 1=urban, 2=green, 3=water
Map.addLayer(CARTclassified, {min: 0, max: 3, palette: ["784800","FFF44F","228B22","97CAF9"]}, "CARTclassification", 1, 0.75);

//Landsat True-Color Image Export
Export.image.toDrive({
  image: CARTclassified,
  description: "classifiedImage_PreCampFire2018l8_Paradise_BigSquare",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0
});