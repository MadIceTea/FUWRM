//Center Map
Map.setCenter(120, 0, 3);

//Load KBDI collection
var collection = ee.ImageCollection("UTOKYO/WTLAB/KBDI/v1")
  .select("KBDI")
  .filterDate("2019-06-01", "2019-06-06");
var band_viz = {
  min: 0,
  max: 800,
  palette: ["Navy", "SkyBlue", "Green", "YellowGreen", "Yellow", "Orange", "DarkOrange", "Red"]
};
Map.addLayer(collection.mean(), band_viz, "KBDI");