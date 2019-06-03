

//Paradise City Shapefile was made an import to save on printed lines

//Sentinel-2 Bands and Human-Friendly Naming
var SENTINEL_2_BANDS = ["B2", "B3","B4","B8","B11","B12"];
var STD_NAMES = ["blue","green","red","nir","swir1","swir2"];

//Add an outline of the city of Paradise
Map.addLayer(paradise, {color: "000000"}, "City of Paradise", 1, 1);

//Center Map
Map.setCenter(-122.505, 39.905, 10);

//filtering Against Paradise at 1-year resolution
var sentinel_SR = ee.ImageCollection("COPERNICUS/S2") //load Sentinel2 raws for the duration of the fire
	.filterBounds(paradise)
	.filterDate("2018-11-08","2018-11-25")
	// No need to filter for cloudy scenes: smoke is a given in fires.
	.select(SENTINEL_2_BANDS, STD_NAMES);

print(sentinel_SR); //date debug

//Display the Composite ImageCollection
Map.addLayer(sentinel_SR, {"bands":["red","blue","green"],min:0,max:2000}, "baselayer", 1, 0);

var single = sentinel_SR.median();

function addNDVI(image) {
  return image
    .addBands(image.normalizedDifference(["nir","red"]).rename("ndvi"))
  ;
}

var ndvi = addNDVI(single);

//Toggle-display the single median-reduced image.
Map.addLayer(single, {"bands":["red","blue","green"],min:0,max:2000}, "median_image", 1, 0.8);

//Map of NDVI vegetation-water probability.
Map.addLayer(ndvi,{bands:["ndvi"],min:0,max:1}, "ndvilayer", 1, 0.15);

//Export Image
var vis = {
  min: 100, 
  max: 2000,
  gamma: 1.5,
  bands: ["red", "green", "blue"]
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

//Sentinel True-Color Image Export
Export.image.toDrive({
  image: single,
  description: "sentinel_averageDuringFire_paradise",
  folder: "California-Paradise_CampFire2018",
  region:paradise,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
});