var collection = ee.ImageCollection("UTOKYO/WTLAB/KBDI/v1")
  .select("KBDI")
  .filterDate("2019-01-01", "2019-01-10");
var band_viz = {
  min: 0,
  max: 800,
  palette: [
    "Navy", "Blue", "SkyBlue", "Green", "YellowGreen", "Peru", "Sienna",
    "Maroon"
  ]
};
Map.addLayer(collection.mean(), band_viz, "ozone");
Map.setCenter(-179, 60, 2);