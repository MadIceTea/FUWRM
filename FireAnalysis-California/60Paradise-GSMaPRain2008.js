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

var collection_a = ee.ImageCollection("JAXA/GPM_L3/GSMaP/v6/reanalysis")
  .select("hourlyPrecipRateGC")
  .filterDate("2008-01-01", "2008-06-01");

var collection_b = ee.ImageCollection("JAXA/GPM_L3/GSMaP/v6/reanalysis")
  .select("hourlyPrecipRateGC")
  .filterDate("2008-06-01", "2009-01-01");

var intermediate = ((collection_a.mean()).add((collection_b.mean())).divide(2));
var single = intermediate.multiply(8766); //8766 hours in 1 year

var band_viz = {
  min: 0, //0mm in a year (@ 0mm/hr)
  max: 877, //0.87m total in a year @ 0.1mm/hr
  palette: ["Red", "DarkOrange", "Orange", "Yellow", "YellowGreen", "Green", "SkyBlue", "Navy"]
};

// Map.addLayer(collection_a, band_viz, "Precip Alpha", 0, 0.85);
// Map.addLayer(collection_b, band_viz, "Precip Beta", 0, 0.85);
Map.addLayer(single, band_viz, "Total Yearly Precipitation", 1, 0.85);

//True-Color Image Export
//Export Image
var vis = {
  min: 0,
  max: 877,
  palette: ["Red", "DarkOrange", "Orange", "Yellow", "YellowGreen", "Green", "SkyBlue", "Navy"],
  bands: ["hourlyPrecipRateGC"]
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

Export.image.toDrive({
  image: single,
  description: "PrecipColored_2008_Paradise_BigSquare",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
});