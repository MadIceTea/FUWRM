/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[128.44236782126666, 38.23664595595953],
          [128.44236782126666, 38.11195324573226],
          [128.61128261618853, 38.11195324573226],
          [128.61128261618853, 38.23664595595953]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//Center Map
Map.centerObject(Big_Square, 11);

var dataset = ee.ImageCollection("FIRMS")
   .filterBounds(Big_Square)
  .filter(ee.Filter.date("2019-04-03", "2019-04-06"));
var fires = dataset.select("T21");
var firesVis = {
  min: 309.6,
  max: 326.3,
  palette: ["red", "orange", "white"],
};
Map.addLayer(fires, firesVis, "Fires", 1, 0.65);

var single = dataset.median().select("T21");

//FIRMS False-Color Image Creation
var vis = {
  min: 309.6,
  max: 326.3,
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