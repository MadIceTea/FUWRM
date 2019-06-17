/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = 
    /* color: #ff6c64 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[144.84399398906248, -37.18091645226004],
          [144.84399398906248, -38.13760786176182],
          [146.16235336406248, -38.13760786176182],
          [146.16235336406248, -37.18091645226004]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//Sentinel-2 Bands and Human-Friendly Naming
var SENTINEL_2_BANDS = ["B2","B3","B4","B8","B11","B12"];
var STD_NAMES = ["blue","green","red","nir","swir1","swir2"];

//filtering Against Melbourne Region at a time resolution during the fire
var sentinel_AR = ee.ImageCollection("COPERNICUS/S2") //load Sentinel2 raws for the duration of the fire
	.filterBounds(Melbourne)
	.filterDate("2009-02-04","2009-02-15")
	// No need to filter for cloudy scenes: smoke is a given in fires.
	.select(SENTINEL_2_BANDS, STD_NAMES);

print(sentinel_AR); //date debug

//Display the Composite ImageCollection
Map.addLayer(sentinel_AR, {"bands":["red","blue","green"],min:0,max:2000}, "baselayer", 1, 0);

var single = sentinel_AR.median();

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
  description: "sentinel_averageDuringFire_Paradise_BigSquare",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
});