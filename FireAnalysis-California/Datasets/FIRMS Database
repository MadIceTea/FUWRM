var dataset = ee.ImageCollection('FIRMS').filter(
    ee.Filter.date('2018-07-21', '2019-08-31'));
var fires = dataset.select('T21');
var firesVis = {
  min: 325.0,
  max: 400.0,
  palette: ['red', 'orange', 'yellow'],
};
Map.addLayer(fires, firesVis, 'Fires');
