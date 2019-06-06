var dataset = ee.ImageCollection("MODIS/006/MCD64A1")
                  .filter(ee.Filter.date("2019-01-01", "2019-06-01"));
var burnedArea = dataset.select("burndate");
var burnedAreaVis = {
  min: 0.0,
  max: 1.0,
};
Map.setCenter(6.746, 46.529, 2);
Map.addLayer(burnedArea, burnedAreaVis, "Burned Area");

print(dataset);