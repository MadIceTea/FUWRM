/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Community_Park = /* color: #bf04c2 */ee.Feature(
        ee.Geometry.Polygon(
            [[[-121.62440152502467, 39.75246215570849],
              [-121.62330718374659, 39.754375777218804],
              [-121.62255616522242, 39.754128329154184],
              [-121.6236505065005, 39.75216520967495],
              [-121.62440152502467, 39.75246215570849]]]),
        {
          "label": "Community Park",
          "system:index": "0"
        }),
    Bille_Park = 
    /* color: #ffc82d */
    /* displayProperties: [
      {
        "type": "marker"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      }
    ] */
    ee.Feature(
        ee.Geometry({
          "type": "GeometryCollection",
          "geometries": [
            {
              "type": "Point",
              "coordinates": [
                -121.6333,
                39.77503
              ]
            },
            {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -121.63560051613365,
                    39.7773042987354
                  ],
                  [
                    -121.63560051613365,
                    39.7748470935795
                  ],
                  [
                    -121.63228530579124,
                    39.7748470935795
                  ],
                  [
                    -121.63228530579124,
                    39.7773042987354
                  ]
                ]
              ],
              "geodesic": false,
              "evenOdd": true
            },
            {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -121.63556832962547,
                    39.77486358518166
                  ],
                  [
                    -121.63556832962547,
                    39.773222651402136
                  ],
                  [
                    -121.63322944336448,
                    39.773222651402136
                  ],
                  [
                    -121.63322944336448,
                    39.77486358518166
                  ]
                ]
              ],
              "geodesic": false,
              "evenOdd": true
            },
            {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -121.63284320526634,
                    39.772958779002636
                  ],
                  [
                    -121.63284320526634,
                    39.770649852358616
                  ],
                  [
                    -121.63201708488975,
                    39.770649852358616
                  ],
                  [
                    -121.63201708488975,
                    39.772958779002636
                  ]
                ]
              ],
              "geodesic": false,
              "evenOdd": true
            },
            {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -121.63308996849571,
                    39.77354424452139
                  ],
                  [
                    -121.63308996849571,
                    39.77333809525885
                  ],
                  [
                    -121.6318990676931,
                    39.77333809525885
                  ],
                  [
                    -121.6318990676931,
                    39.77354424452139
                  ]
                ]
              ],
              "geodesic": false,
              "evenOdd": true
            }
          ],
          "coordinates": []
        }),
        {
          "label": "Bille Park",
          "system:index": "0"
        }),
    Aquatic_Memorial_Park = 
    /* color: #07e8ff */
    /* displayProperties: [
      {
        "type": "rectangle"
      },
      {
        "type": "marker"
      },
      {
        "type": "marker"
      },
      {
        "type": "marker"
      },
      {
        "type": "marker"
      }
    ] */
    ee.Feature(
        ee.Geometry({
          "type": "GeometryCollection",
          "geometries": [
            {
              "type": "Polygon",
              "coordinates": [
                [
                  [
                    -121.61444307919567,
                    39.751852734820844
                  ],
                  [
                    -121.61444307919567,
                    39.75012876501868
                  ],
                  [
                    -121.6136384164912,
                    39.75012876501868
                  ],
                  [
                    -121.6136384164912,
                    39.751852734820844
                  ]
                ]
              ],
              "geodesic": false,
              "evenOdd": true
            },
            {
              "type": "Point",
              "coordinates": [
                -121.61346675511425,
                39.75019475508752
              ]
            },
            {
              "type": "Point",
              "coordinates": [
                -121.61382080670421,
                39.74990604806971
              ]
            },
            {
              "type": "Point",
              "coordinates": [
                -121.6145932829005,
                39.74979881372638
              ]
            },
            {
              "type": "Point",
              "coordinates": [
                -121.61461474057262,
                39.75053295319813
              ]
            }
          ],
          "coordinates": []
        }),
        {
          "label": "Aquatic (Memorial) Park",
          "system:index": "0"
        }),
    Big_Square = /* color: #acc235 */ee.Geometry.Polygon(
        [[[-122.03757135752642, 40.231519880601745],
          [-122.03757135752642, 39.49365087730002],
          [-121.16965143565142, 39.49365087730002],
          [-121.16965143565142, 40.231519880601745]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//Center Map
Map.setCenter(-121.619, 39.894, 10);

// We use a LANDSAT 8 image from six months before the fire (June 1, 2018).
var image = ee.Image("LANDSAT/LC08/C01/T1_SR/LC08_044032_20180601")
    .select(["B[1-7]"]);
Map.addLayer(image, {bands: ["B4", "B3", "B2"], min: 0, max: 2000});

print(image);

// Define and display a FeatureCollection of three known locations.
var points = ee.FeatureCollection([
  Community_Park,
  Bille_Park,
  Aquatic_Memorial_Park,
]);

Map.addLayer(points);

// Define customization options.
var options = {
  title: "Landsat 8 SR spectra for polygons in the Town of Paradise, Pre-Fire",
  hAxis: {title: "Wavelength (micrometers)"},
  vAxis: {title: "Reflectance"},
  lineWidth: 1,
  pointSize: 4,
  min: 0,
  max: 4000,
  series: {
    0: {color: "orange"}, // Community Park
    1: {color: "purple"}, // Bille Park
    2: {color: "teal"}, // Aquatic (now Memorial) Park
}};

// Define a list of Landsat 8 wavelengths for X-axis labels.
var wavelengths = [0.44, 0.48, 0.56, 0.65, 0.86, 1.61, 2.2];

// Create the chart and set options.
var spectraChart = ui.Chart.image.regions(
    image, points, ee.Reducer.mean(), 30, "label", wavelengths)
        .setChartType("ScatterChart")
        .setOptions(options);

// Display the chart in Console.
print(spectraChart);