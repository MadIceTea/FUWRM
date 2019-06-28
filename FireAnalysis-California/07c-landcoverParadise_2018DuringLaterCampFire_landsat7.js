/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = /* color: #acc235 */ee.Geometry.Polygon(
        [[[-122.03757135752642, 40.231519880601745],
          [-122.03757135752642, 39.49365087730002],
          [-121.16965143565142, 39.49365087730002],
          [-121.16965143565142, 40.231519880601745]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//L7SR Bands and Human-Friendly Naming
var LANDSAT_7_BANDS = ["B1","B2","B3","B4","B5","B6","B7"];
var STD_NAMES = ["blue","green","red","nir","swir1","tir","swir2"];

//filtering Against Paradise at 1-year resolution
var landsat_SR = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR") //load LANDSAT7 raws for during the fire period
	.filterBounds(Paradise)
	.filterDate("2018-11-08","2018-11-25")
	.filter(ee.Filter.lt("CLOUD_COVER", 35))
	.select(LANDSAT_7_BANDS, STD_NAMES);

print(landsat_SR); //date debug

/*
Black Image background
Map.addLayer(ee.Image(0), {color: "000000"}, "Black Background", 1, 1);
*/

var single = landsat_SR.median();

//Display the Composite
Map.addLayer(landsat_SR, {"bands":["red","green","blue"],min:0,max:2000}, "baselayer", 1, 0);
//Map.addLayer(landsat_SR, {"bands":["tir"],min:0,max:2000}, "temperature", 1, 1);

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
  description: "landsat_duringFire2018l7_Paradise_BigSquare",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
});