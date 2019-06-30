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

//Also import the small town regions of Labertouche, DrouinWest, and Tonimbuk which burned in the Bunyip State Park Fire
var Labertouche = ee.FeatureCollection("ft:1Wsbt3y1em75OyN2vfvQhHjbI7XTptMFQFeT069n5").geometry();
var DrouinWest = ee.FeatureCollection("ft:1g2cJ9z_o3gnFKfYxbPtF6DYgBOe-JUDoNHRhJqBQ").geometry();
var Tonimbuk = ee.FeatureCollection("ft:1tqsM6Mt1HQD5QE_VF3vyDcj7beSlX0YQzHDSa2dd").geometry();

// show the layers
Map.addLayer(Victoria, {color: "55EAEC"}, "Province of Victoria, Australia", 1, 0.4); //light blue
Map.addLayer(Melbourne, {color: "000000"}, "Melbourne, VIC, Australia", 1, 0.3); //black
Map.addLayer(BuxNarbMary, {color: "BF19DB"}, "Buxton-Narbelthong-Marysville, VIC, Australia", 1, 1); //purple
Map.addLayer(Kinglake, {color: "31994D"}, "Kinglake, VIC, Australia", 1, 1); //green
Map.addLayer(Labertouche, {color: "270BFF"}, "Labertouche, VIC, Australia", 1, 1); //royal-deep blue
Map.addLayer(DrouinWest, {color: "C18AB9"}, "Drouin West, VIC, Australia", 1, 1); //purple
Map.addLayer(Tonimbuk, {color: "ADC91F"}, "Tonimbuk, VIC, Australia", 1, 1); //darker green

//Center Map
Map.centerObject(Big_Square, 9);

var collection = ee.ImageCollection("NASA/GLDAS/V021/NOAH/G025/T3H")
  .select("SoilTMP0_10cm_inst")
  .filterDate("2009-01-01", "2009-02-01");

var band_viz = {
  min: 273.15, //0C
  max: 298.15, //25C
  palette: ["Navy", "SkyBlue", "Green", "YellowGreen", "Yellow", "Orange", "DarkOrange", "Red"]
};

var single = collection.mean();

Map.addLayer(single, band_viz, "Average At-Surface Soil Temperature", 1, 0.85);

//True-Color Image Export
//Export Image
var vis = {
  min: 273.15,
  max: 298.15,
  palette: ["Navy", "SkyBlue", "Green", "YellowGreen", "Yellow", "Orange", "DarkOrange", "Red"],
  bands: ["SoilTMP0_10cm_inst"]
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
  description: "TempsColored_preFire2009_Victoria_BigSquare",
  folder: "Australia-Victoria_BlackFire2009",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
});