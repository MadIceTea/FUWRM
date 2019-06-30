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
// Import the metropolitan regions of Melbourne, Buxton-Narbethlong-Marysville, and the Kinglake Cities
var BuxNarbMary = ee.FeatureCollection("ft:1hseXyjCm5NM3krhX5qJB6-Gkl0e5o84tBD1WnbeJ").geometry();
var Kinglake = ee.FeatureCollection("ft:1uTaTWzmTW02jGVsMa6AggqK6ncqY2527kJQh1t1z").geometry();

//Also import the small town regions of Labertouche, DrouinWest, and Tonimbuk which burned in the Bunyip State Park Fire
var Labertouche = ee.FeatureCollection("ft:1Wsbt3y1em75OyN2vfvQhHjbI7XTptMFQFeT069n5").geometry();
var DrouinWest = ee.FeatureCollection("ft:1g2cJ9z_o3gnFKfYxbPtF6DYgBOe-JUDoNHRhJqBQ").geometry();
var Tonimbuk = ee.FeatureCollection("ft:1tqsM6Mt1HQD5QE_VF3vyDcj7beSlX0YQzHDSa2dd").geometry();

//Center Map
Map.centerObject(Big_Square, 9);

//The longer list of all firefighting locations
var firefight = ee.FeatureCollection("ft:1b9SQEYUNBQCghsQCkUlAfarb8feC4dNe87l9eaaj").geometry();

//The broken-down list of formal Fire Stations (FS) and Country Fire Authorities (CFA)
var FS =  ee.FeatureCollection("ft:1ipQ6dhXZGQbApdgJtgxYtFbc7fJH_ty2iy19TKfg").geometry();
var CFA =  ee.FeatureCollection("ft:1tS0GgWvzSa0_Nq_uBcZnC7irJJ45T-bybXBMBzXf").geometry();

// show the layers
Map.addLayer(Big_Square, {color: "55EAEC"}, "Region of Interest", 1, 0.15); //light blue
Map.addLayer(FS, {color: "31994D"}, "Kinglake, VIC, Australia", 1, 1); //green
Map.addLayer(CFA, {color: "C18AB9"}, "Drouin West, VIC, Australia", 1, 1); //purple
Map.addLayer(firefight, {color: "ADC91F"}, "Tonimbuk, VIC, Australia", 0, 1); //darker green