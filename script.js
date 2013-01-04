
// Datos y Mapa IDs
var map;
var data_id = '0Asc521FZEVkpdFNEYl9UTnNkV0FOdXdEME9keVhnanc';
var map_id = 'colaborativa.OSMCordoba';
// Extracting Data from Google Drive, on finished call mapData function
mmg_google_docs_spreadsheet_1(data_id, mapData );
// Create and set Map
$('#map').mapbox('colaborativa.OSMCordoba', function(mapTemp, tilejson) {
    map = mapTemp;
    map.setZoomRange(14, 16);
    map.centerzoom({ lat: 37.885, lon: -4.79 }, 14);
    map.setPanLimits([{ lat: 37.9189, lon: -4.8339 }, { lat: 37.8455, lon: -4.7062 }]);
    map.zoom(14, true);
});
// Load points
function mapData(f) {
    features = f;
    // Adding points to map
    markerLayer = mapbox.markers.layer().features(features);
    // Adding interaction layer
    interaction = mapbox.markers.interaction(markerLayer);
    map.addLayer(markerLayer);
    // Defining interactive layer
    interaction.formatter(function (feature) {
        var o = '<h3>' + feature.properties.titulo + '</h3>' +
            '<img src="' + feature.properties.enlace + '" alt="' + feature.properties.titulo + '">' +
            '<p>' + feature.properties.descripcion + '</p>';
        return o;
    });
    download_data();
}
/*
Function for put href for download data
URL Spreadsheet #DisponibleEnCordoba
https://docs.google.com/spreadsheet/pub?key=0Asc521FZEVkpdFNEYl9UTnNkV0FOdXdEME9keVhnanc&single=true&gid=0&output=csv
*/
function download_data() {
    $('#download_csv').attr('href', 'https://docs.google.com/spreadsheet/pub?key=' + data_id + '&output=csv');
    $('#download_json').attr('href', 'https://spreadsheets.google.com/feeds/list/' + data_id + '/od6/public/values?alt=json-in-script');
}


