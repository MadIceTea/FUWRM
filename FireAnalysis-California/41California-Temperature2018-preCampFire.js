/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = /* color: #acc235 */ee.Geometry.Polygon(
        [[[-122.03757135752642, 40.231519880601745],
          [-122.03757135752642, 39.49365087730002],
          [-121.16965143565142, 39.49365087730002],
          [-121.16965143565142, 40.231519880601745]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Import the primary region of interest, Town of Paradise which burned in the Camp Fire of 2018.
var Paradise = ee.FeatureCollection("ft:1JIO1SLcMe08lHJWUIP7zWpW5razN6FfIwibHtcje").geometry();

//Also import the small town region of Magalia to the north, and the larger city of Chico to the west.
var Magalia = ee.FeatureCollection("ft:1BCMRnYS4plV2NVWtP6dZHYmE1V00kY8baAPU9Udm").geometry();
var Chico = ee.FeatureCollection("ft:1mmRj4fN8mmvtynTxG56XMZJ-1y9n1i-lDUCIsXwV").geometry();

// show the layers
Map.addLayer(Paradise, {color: "280AC2"}, "Town of Paradise, California", 1, 1); //deep purple
Map.addLayer(Magalia, {color: "91184E"}, "Town of Magalia, California", 1, 1); //reddish-purple
Map.addLayer(Chico, {color: "1C06C2"}, "City of Chico, California", 1, 1); //deep blue

//Center Map
Map.centerObject(Paradise, 10);

// TODO
// Change from the N. American DLAS to Global DLAS




//Center the Map
Map.setCenter(-121.619, 39.894, 10);

//Add an outline of Town of Paradise.
Map.addLayer(Paradise, {color: "acc235"}, "Town of Paradise", 1, 1);

var dataset = ee.ImageCollection('NASA/NLDAS/FORA0125_H002')
                  .filter(ee.Filter.date('2018-05-08', '2018-11-08'));
var temperature = dataset.select('temperature');
var temperatureVis = {
  min: 10,
  max: 26,
  palette: ['3d2bd8', '4e86da', '62c7d8', '91ed90', 'e4f178', 'ed6a4c'],
};
Map.addLayer(temperature, temperatureVis, 'Temperature');

print(temperature);