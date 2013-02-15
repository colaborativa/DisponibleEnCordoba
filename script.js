//
//
// Project: DisponibleEnCordoba
// Author: Magda Sanchez from Colaborativa.eu
// Last Updated:
//      14-02-2012: Adding on click show marker info on left window with id contentDetail. 
//
//
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
    map.setPanLimits([{ lat: 37.9452, lon: -4.8641 }, { lat: 37.8133, lon: -4.6835 }]);
    map.zoom(14, true);
});
// Load points
/*
    <div id="contentDetail">
    </div>
    // <div class="limiter">
        <div id="about">
          <h1 class='map-title'>
          </h1>
          <h2></h2>
          <p class='description'></p>
        </div>
        <p class="footer"></p>
      </div>
*/
function mapData(f) {
    features = f;
    // Adding points to map
    markerLayer = mapbox.markers.layer().features(features).factory(function(f) {
        var elem = mapbox.markers.simplestyle_factory(f);
        MM.addEvent(elem, 'click', function(e) {
           // f.properties.titulo f.properties.direccion f.properties.descripcion f.properties.estado 
           // f.properties.enlace f.properties.categoria f.properties.masinfo 
            var imagen='';
            var masinfo='';
            var descripcion='';
            var direccion='';       
            var titulo = '<h2>' + f.properties.titulo + '</h2>'
            $('#contentDetail').removeClass('inactivo').addClass('activo'); //css('display','block');
            $('#contentDetail').html(''); // clean current div structure
            $('#contentDetail').append('<a class="closeWindow" href="#">&#10006;</a><script> $(".closeWindow").click(function(){ $("#contentDetail").removeClass("activo").addClass("inactivo"); return false; });</script>'); 
            $('#contentDetail').append('<h1 class="map-title"><span class="element-invisible">#DisponibleEnCordoba</span></h1>');
            $('#contentDetail').append(titulo); // h1 class='map-title'
            if( f.properties.direccion  != ''){
                direccion = '<h3>' + f.properties.direccion + '</h3>';
                $('#contentDetail').append(direccion); // h2 direccion
            }
            if( f.properties.enlace != ''){
                imagen = '<div class="imagen"><img src="' + f.properties.enlace + '" alt="' + f.properties.titulo + '"></div>';
                $('#contentDetail').append(imagen);
            }
            if( f.properties.descripcion != ''){
                descripcion =  '<p>' + f.properties.descripcion + '</p>';
                $('#contentDetail').append(descripcion);
            }
            if( f.properties.masinfo != ''){
                masinfo = '<a href="' + f.properties.masinfo + '">Enlace externo</a>';
                $('#contentDetail').append(masinfo);
            }
          });
        return elem;
    });
    
    // Adding interaction layer
    interaction = mapbox.markers.interaction(markerLayer);
    map.addLayer(markerLayer);
    
    // Defining interactive layer
    interaction.formatter(function (feature) {
        var direccion='';       
        if( feature.properties.direccion  != ''){
            direccion = '<h3>' + feature.properties.direccion + '</h3>';
        }
        var o = '<h2>' + feature.properties.titulo + '</h2>' + direccion;
        return o;
    });
    download_data();
}
/*
Function for put href for download data
URL Spreadsheet #DisponibleEnCordoba
https://docs.google.com/spreadsheet/pub?key=0Asc521FZEVkpdFNEYl9UTnNkV0FOdXdEME9keVhnanc&single=true&gid=0&output=csv
https://docs.google.com/spreadsheet/pub?key=0Asc521FZEVkpdFNEYl9UTnNkV0FOdXdEME9keVhnanc&single=true&gid=0&output=csv
https://spreadsheets.google.com/feeds/list/0Asc521FZEVkpdFNEYl9UTnNkV0FOdXdEME9keVhnanc/od6/public/values?alt=json-in-script

*/
function download_data() {
    $('#download_csv').attr('href', 'https://docs.google.com/spreadsheet/pub?key=' + data_id + '&output=csv');
    $('#download_json').attr('href', 'https://spreadsheets.google.com/feeds/list/' + data_id + '/od6/public/values?alt=json-in-script');
}
