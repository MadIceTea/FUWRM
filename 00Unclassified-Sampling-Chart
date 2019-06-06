// Load and display a Landsat 8 image's reflective bands.
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_026047_20140216')
    .select(['B[1-7]']);
Map.addLayer(image, {bands: ['B5', 'B4', 'B3'], min: 0, max: 0.5});

// Define and display a FeatureCollection of three known locations.
var points = ee.FeatureCollection([
  park,
  park2,
  park3,
  // farm,
  // urban
]);
Map.addLayer(points);

// Define customization options.
var options = {
  title: 'Landsat 8 TOA spectra at three points near Mexico City',
  hAxis: {title: 'Wavelength (micrometers)'},
  vAxis: {title: 'Reflectance'},
  lineWidth: 1,
  pointSize: 4,
  series: {
    0: {color: '00FF00'}, // park
    1: {color: '0000FF'}, // farm
    2: {color: 'FF0000'}, // urban
}};

// Define a list of Landsat 8 wavelengths for X-axis labels.
var wavelengths = [0.44, 0.48, 0.56, 0.65, 0.86, 1.61, 2.2];

// Create the chart and set options.
var spectraChart = ui.Chart.image.regions(
    image, points, ee.Reducer.mean(), 30, 'label', wavelengths)
        .setChartType('ScatterChart')
        .setOptions(options);

// Display the chart.
print(spectraChart);
    