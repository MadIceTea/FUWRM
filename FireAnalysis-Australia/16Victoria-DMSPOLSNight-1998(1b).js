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

//Import images for 1998, around a decade before the Black Fire.
//Use DMSP-OLS dataset Nighttime lights set.
var collection = ee.ImageCollection("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS")
  .filterDate("1998-01-01","1999-01-01") // for 1998
  .filterBounds(Big_Square); //around the export area
  
var DMSP = collection.median(); //lighting composite, taking median values

//Display Layers on the Map with limited range of values.
//Minimum is set to 1 to eliminate street lighting.
Map.addLayer(DMSP,{bands:["avg_vis", "stable_lights", "cf_cvg"],min:0,max:64.5}, "median nightmap", 0, 0.9);
var single = DMSP.select("stable_lights");
Map.addLayer(single,{bands:["stable_lights"],min:0,max:63,palette: ["black", "orange", "white"]},"average cleaned nightmap", 1, 0.9);

Export.image.toDrive({
  image: single,
  description: "DMSPColored_1998_Paradise_BigSquare-1b",
  folder: "Australia-Victoria_BlackFire2009",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true},
});