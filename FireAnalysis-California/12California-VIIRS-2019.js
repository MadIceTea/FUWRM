//Import images for 2019, after CampFire died out.
//VIIRS Lvl.1 product does not filter out light from fires, so seperating this time period is necessary to determine true population density.
var collection = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG")
  .filterDate("2019-01-01","2019-06-01") // for 2019 (skipping the month after Camp Fire ended)
  .filterBounds(Paradise); //around the Town of Paradise, California, USA

var viirs = collection.median(); //lighting composite, taking median values

//Center Map
Map.setCenter(-121.619, 39.894, 10);

//Display Layers on the Map with range of values that will eliminate street lighting and still light small towns such as Paradise and Magnolia, significantally.
Map.addLayer(Paradise, {color: "acc235"}, "Town of Paradise", 1, 1);
Map.addLayer(viirs,{bands:["avg_rad", "avg_rad", "cf_cvg"],min:1,max:10}, "yearly median nightmap", 0, 1);
var single = viirs.select("avg_rad");
Map.addLayer(single,{bands:["avg_rad"],min:1,max:10},"average masked nightmap", 1, 0.9);

//debug
print(collection);
print(viirs);
print(single);

//Export Process
var vis = {
  min: 1, 
  max: 10,
  gamma: 1.5,
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

//VIIRS True-Color Image Export
Export.image.toDrive({
  image: single,
  description: "VIIRS_afterFire_Paradise",
  folder: "California-Paradise_CampFire2018",
  region:Paradise,
  scale:30.0,
  fileFormat: "GeoTIFF",
  crs: "EPSG:3857",
  formatOptions: {cloudOptimized: true}
});