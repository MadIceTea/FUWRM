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

//Center Map
Map.centerObject(Paradise, 10);

//The list of all firefighting locations
var FS =  ee.FeatureCollection("ft:1ZP4SIemODeXdRHi4DixnW14nsWp9M9o-Ort59f0v").geometry();
var EFS = ee.FeatureCollection("ft:1HvKhfJBdlAJrnHsfdCyLfxvbiA4dSewTjb9WEpZ2").geometry();
var VFS =  ee.FeatureCollection("ft:1s_3k4biIxmdWbK1xrcAEA-NmgO7LsnAGIczQQ8H4").geometry();
var firefight = ee.FeatureCollection("ft:1FzuhZVp5Y2xk0imZVxnHnVTv4NX1goh9vi9xp1bW").geometry();

//Black Image background toggle for visibility
Map.addLayer(ee.Image(0), {color: "000000"}, "Black Background", 1, 0.85);

// show the layers
Map.addLayer(Big_Square, {color: "55EAEC"}, "Region of Interest", 1, 0.15); //light blue
Map.addLayer(Paradise, {color: "280AC2"}, "Town of Paradise, California", 1, 0.45); //deep purple
Map.addLayer(Magalia, {color: "91184E"}, "Town of Magalia, California", 1, 0.45); //reddish-purple
Map.addLayer(Chico, {color: "1C06C2"}, "City of Chico, California", 1, 0.45); //deep blue
Map.addLayer(firefight, {color: "ADC91F"}, "All Firefighting Locations", 1, 1); //darker green
Map.addLayer(FS, {color: "FF6C64"}, "Fire Stations", 1, 1); //red
Map.addLayer(VFS, {color: "C18AB9"}, "Volunteer Fire Station", 1, 1); //purple
Map.addLayer(EFS, {color: "17FF2B"}, "Ex-Fire Station", 1, 1); //neon green