/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = 
    /* color: #98ff00 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[23.691849022438532, 38.151381357589514],
          [23.691849022438532, 37.89661465827206],
          [24.033798485329157, 37.89661465827206],
          [24.033798485329157, 38.151381357589514]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//Center Map
Map.centerObject(Big_Square, 11);

var dataset = ee.ImageCollection("FIRMS")
  // .filterBounds(Big_Square)
  //.filter(ee.Filter.date("2005-07-28", "2005-07-29")); //interesting, there was a fire here in 2005 as well
  .filter(ee.Filter.date("2018-07-22", "2018-07-27"));
var fires = dataset.select("T21");
var firesVis = {
  min: 302.5,
  max: 343.8,
  palette: ["red", "orange", "white"],
};
Map.addLayer(fires, firesVis, "Fires", 1, 0.65);

var single = dataset.median().select("T21");

//FIRMS False-Color Image Creation
var vis = {
  min: 305.4, 
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