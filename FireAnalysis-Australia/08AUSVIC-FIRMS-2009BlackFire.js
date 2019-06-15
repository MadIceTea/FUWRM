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
// Import the Province of Victoria from Fusion Table
var Victoria = ee.FeatureCollection("ft:1UzSGq1cWUA5PloR9VxO7AVTu4vVXL3BHNiJKv6XB").geometry();

// Also import the metropolitan regions of Melbourne, Buxton-Narbethlong-Marysville, and the Kinglake Cities
var Melbourne = ee.FeatureCollection("ft:1IS6OpUOtWinTQd2KKzFHIyLQEOy_Mf-Pg7f7j1qz").geometry();
var BuxNarbMary = ee.FeatureCollection("ft:1hseXyjCm5NM3krhX5qJB6-Gkl0e5o84tBD1WnbeJ").geometry();
var Kinglake = ee.FeatureCollection("ft:1uTaTWzmTW02jGVsMa6AggqK6ncqY2527kJQh1t1z").geometry(); 

// show the layers
Map.addLayer(Victoria, {color: "55EAEC"}, "Province of Victoria, Australia", 1, 0.5);
Map.addLayer(Melbourne, {color: "4229FF"}, "Melbourne, VIC, Australia", 1, 0.3);
Map.addLayer(BuxNarbMary, {color: "BF19DB"}, "Buxton-Narbelthong-Marysville, VIC, Australia", 1, 0.8);
Map.addLayer(Kinglake, {color: "31994D"}, "Kinglake, VIC, Australia", 1, 0.8);

//Center Map
Map.setCenter(145.5032, -37.6399, 6);

var dataset = ee.ImageCollection("FIRMS")
  .filterBounds(Big_Square)
  .filter(ee.Filter.date("2009-02-06", "2009-03-15"));
var fires = dataset.select("T21");
var firesVis = {
  min: 305.1,
  max: 504.4,
  palette: ["red", "orange", "white"],
};
Map.addLayer(fires, firesVis, "Fires");

var single = dataset.median().select("T21");

//FIRMS False-Color Image Creation
var vis = {
  min: 305.1, 
  max: 504.4,
  palette: ["red", "orange", "white"],
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

//FIRMS False-Color Image Export
Export.image.toDrive({
  image: single,
  description: "FIRMS_2018average_Victoria_BigSquare",
  folder: "Australia-Victoria_BlackFire2009",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
});