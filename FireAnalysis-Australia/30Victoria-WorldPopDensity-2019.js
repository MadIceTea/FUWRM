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
//Should be near-redundant to the VIIRS data.
//Seems like GPWv4, with "Machine learning".

var single = ee.Image("users/GEE_Alex/WorldPop_AUS/WorldPop_AUS_2019").select("b1"); //Import AUS 2019 data image

//debug
print(single);

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

//Display Layers on the Map with limited range of values.
Map.addLayer(single, {"bands":["b1"],min:1,max:10,palette: ["black", "orange", "white"]}, "population density", 1, 0.85);

//Export Process
var vis = {
  min: 1, 
  max: 10,
  palette: ["black", "orange", "white"],
};

// visualize image using visOpts above
// turning it into 8-bit visible image.
single = single.visualize(vis);

// obtain native scale of avg_rad band
var scale = single.projection().nominalScale().getInfo();

// add an alpha channel as 4th band to mask no data regions
var mask = single.mask().reduce(ee.Reducer.min())
    .multiply(255).toByte();
single = single.addBands(mask);

//WorldPop Image Export
Export.image.toDrive({
  image: single,
  description: "WorldPop2019_Victoria_BigSquare",
  folder: "Australia-Victoria_BlackFire2009",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
});