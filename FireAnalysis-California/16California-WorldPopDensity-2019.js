//Should be near-redundant to the VIIRS data.
//Seems like GPWv4, with "Machine learning".

var single = ee.Image("users/GEE_Alex/WorldPop_USA_2019").select("b1"); //Import USA 2018 data image

//debug
print(single);

//Center Map
Map.setCenter(-121.619, 39.894, 10);

//Display Layers on the Map with limited range of values.
Map.addLayer(Paradise, {color: "acc235"}, "Town of Paradise", 1, 1);
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

//GPWv4 Image Export
Export.image.toDrive({
  image: single,
  description: "WorldPop2018_Paradise_BigSquare",
  folder: "California-Paradise_CampFire2018",
  region:Big_Square,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
});