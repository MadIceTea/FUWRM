//Center the Map
Map.setCenter(-121.619, 39.894, 10);

//Add an outline of Town of Paradise.
Map.addLayer(Paradise, {color: "acc235"}, "Town of Paradise", 1, 1);

var dataset = ee.ImageCollection("MODIS/006/MCD64A1")
                  .filter(ee.Filter.date("2018-11-01", "2019-12-01"));
var burnedArea = dataset.select("BurnDate");
var burnedAreaVis = {
  min: 312.0, // Nov. 8th, 2018 (CampFire sparked)
  max: 329.0, // Nov. 25th, 2018 (CampFire contained)
  palette:["Black","Orange","Azure"]
};
Map.addLayer(burnedArea, burnedAreaVis, "Burned Area");

print(dataset);

single = dataset.first();

//Export Process
var vis = {
  min: 0, 
  max: 1200,
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

//MODIS MCD64A1 Product Image Export
Export.image.toDrive({
  image: single,
  description: "MODIS_MCD64A1-2018_CampFireBurnScar_Paradise_BigSquare",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
});