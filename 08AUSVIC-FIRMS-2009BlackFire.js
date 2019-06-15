/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = 
    /* color: #acc235 */
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
//Center Map
Map.setCenter(Big_Square);

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