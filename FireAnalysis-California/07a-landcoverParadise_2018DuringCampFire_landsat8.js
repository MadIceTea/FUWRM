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
var LANDSAT_8_BANDS = ["B2", "B3", "B4","B5","B6","B10","B7"];
var STD_NAMES = ["blue","green","red","nir","swir1","tir","swir2"];

//filtering Against Paradise for the duration of the Camp Fire
var landsat_SR = ee.ImageCollection("LANDSAT/LC08/C01/T1_SR") //load LANDSAT8 raws for during the fire period
	.filterBounds(Paradise)
	.filterDate("2018-11-08","2018-11-25")
	// No need to filter for cloudy scenes: smoke is a given in fires.
	.select(LANDSAT_8_BANDS, STD_NAMES);

print(landsat_SR); //date debug

var single = landsat_SR.median();

//Display the Composite
Map.addLayer(landsat_SR, {"bands":["red","green","blue"],min:0,max:2000}, "baselayer", 1, 0);

var inputimage = landsat_SR.median();

function addNDVI(image) {
  return image
    .addBands(image.normalizedDifference(["nir","red"]).rename("ndvi"))
  ;
}

var ndvi = addNDVI(inputimage);

//Toggle-display the single median-reduced image.
Map.addLayer(single, {"bands":["red","green","blue"],min:0,max:2000}, "median_image", 1, 0.8);

//Map of NDVI vegetation-water probability.
Map.addLayer(ndvi,{bands:["ndvi"],min:0,max:1}, "ndvilayer", 1, 0.15);

//Landsat True-Color Image Export
//Export Image
var vis = {
  min: 100, 
  max: 2000,
  gamma: 1.5,
  bands: ["red","green","blue"]
};

// visualize image using visOpts above
// turning it into 8-bit RGB image.
single = single.visualize(vis);

// obtain native scale of RGB bands
var scale = single.projection().nominalScale().getInfo();

// add an alpha channel as 4th band to mask no data regions
var mask = single.mask().reduce(ee.Reducer.min())
    .multiply(255).toByte();
single = single.addBands(mask);

//Landsat True-Color Image Export
Export.image.toDrive({
  image: single,
  description: "landsat8_duringFire_Paradise_BigSquare",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
});