/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Big_Square = 
    /* color: #ff6c64 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[144.84399398906248, -37.18091645226004],
          [144.84399398906248, -38.13760786176182],
          [146.16235336406248, -38.13760786176182],
          [146.16235336406248, -37.18091645226004]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//Center Map
Map.centerObject(Big_Square, 9);

//The longer list of all firefighting locations
var firefight = ee.FeatureCollection("ft:1b9SQEYUNBQCghsQCkUlAfarb8feC4dNe87l9eaaj").geometry();

//The broken-down list of formal Fire Stations (FS) and Country Fire Authorities (CFA)
var FS =  ee.FeatureCollection("ft:1ipQ6dhXZGQbApdgJtgxYtFbc7fJH_ty2iy19TKfg").geometry();
var CFA =  ee.FeatureCollection("ft:1tS0GgWvzSa0_Nq_uBcZnC7irJJ45T-bybXBMBzXf").geometry();

// show the layers
Map.addLayer(Big_Square, {color: "55EAEC"}, "Region of Interest", 1, 0.2); //light blue
Map.addLayer(FS, {color: "31994D"}, "Kinglake, VIC, Australia", 1, 0.85); //green
Map.addLayer(CFA, {color: "C18AB9"}, "Drouin West, VIC, Australia", 1, 75); //purple
Map.addLayer(firefight, {color: "ADC91F"}, "Tonimbuk, VIC, Australia", 0, 1); //darker green