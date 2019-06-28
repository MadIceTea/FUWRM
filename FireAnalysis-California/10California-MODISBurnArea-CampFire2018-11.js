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

var dataset = ee.ImageCollection("MODIS/006/MCD64A1")
                  .filter(ee.Filter.date("2018-11-01", "2018-12-01"));
var burnedArea = dataset.select("BurnDate");
var burnedAreaVis = {
  min: 312.0, // Nov. 8th, 2018 (CampFire sparked)
  max: 329.0, // Nov. 25th, 2018 (CampFire contained)
  palette:["black","grey","white"]
};
Map.addLayer(burnedArea, burnedAreaVis, "Burned Area");

print(dataset);

single = dataset.first().select("BurnDate");

//Export Process
var vis = {
  min: 312, 
  max: 329,
  palette: ["black","grey","white"],
};

// visualize image using visOpts above
// turning it into 8-bit visible image.
var single = single.visualize(vis);

// obtain native scale of avg_rad band
var scale = single.projection().nominalScale().getInfo();

// add an alpha channel as 4th band to mask no data regions
var mask = single.mask().reduce(ee.Reducer.min())
    .multiply(255).toByte();
single = single.addBands(mask);

//MODIS MCD64A1 Product Image Export
Export.image.toDrive({
  image: single,
  description: "MODIS_MCD64A1-2018_CampFireBurnScar_Paradise_BigSquare",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
});