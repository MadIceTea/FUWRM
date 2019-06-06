var population = ee.ImageCollection("CIESIN/GPWv4/population-count")
  .filterDate("2018-12-31","2020-01-10") // for Dec. 2018 (Camp Fire Immediate Aftermath)
  .filterBounds(Paradise); //around the Town of Paradise, California, USA
  
//debug
print(population);

//Center Map
Map.setCenter(-121.619, 39.894, 10);

//Display Layers on the Map with limited range of values.
Map.addLayer(Paradise, {color: "acc235"}, "Town of Paradise", 1, 1);
Map.addLayer(population, {"bands":["population-count"],min:0,max:800,palette: ["purple", "blue", "red"]}, "population", 1, 0.9);