//Center Map
// Map.setCenter(-121.619, 39.894, 10);

var collection = ee.ImageCollection('UTOKYO/WTLAB/KBDI/v1')
  .select("KBDI")
  .filterDate("2018-01-01", "2018-11-07");
var band_viz = {
  min: 0,
  max: 800,
  palette: ["Navy", "SkyBlue", "Green", "YellowGreen", "Yellow", "Orange", "DarkOrange", "Red"]
};
Map.addLayer(collection.mean(), band_viz, "KBDI");