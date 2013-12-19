//     dec-principal.js 1.0  under MIT license
//     
//     2013  (c) colaborativa.eu and contributors
//     http://colaborativa.eu/proyectos/disponible-en-cordoba/

// Definición variables globales
// ------------------------------
var DEBUG_MAP = 0;
var map;
// Definición de los identificadores para el mapa y la fuente de los datos en **Google Drive**.
// Sustituir por vuestros identificadores específicos.
var data_id = '0Asc521FZEVkpdFNEYl9UTnNkV0FOdXdEME9keVhnanc';
var map_id = 'colaborativa.OSMCordoba';

// Creación e inicialización del objeto mapa
$('#map').mapbox('colaborativa.OSMCordoba', function(mapTemp, tilejson) {
    if( DEBUG_MAP) {console.log("creating map");}
    map = mapTemp;
    map.setZoomRange(14, 16);
    map.centerzoom({ lat: 37.885, lon: -4.79 }, 14);
    map.setPanLimits([{ lat: 37.9452, lon: -4.8641 }, { lat: 37.8133, lon: -4.6835 }]);
    map.zoom(14, true);
});
$( document ).ready(function() {
// Función Principal
// ------------------------------
// Obtención de los datos de la spreadsheet en **Google Drive**. 
// La función `mg_google_docs_spreadsheet_1` está definida en `dec-google_docs.js`.
// Al terminar y ya que se ha definido callback, se invocará la función mapData definida más abajo.
mmg_google_docs_spreadsheet_1(data_id, mapData);


// Funciones Auxiliares
// --------------------
// La función `mapData` se encarga de definir todas las capas del mapa, crear los markers (pinchos),
// definir los eventos asociados a acciones sobre el mapa (mouse click, mouse over) y
// añadir información en la barra lateral izquiera sobre el marker (pincho o edificio) seleccionado.
function mapData(f) {
    if( DEBUG_MAP) {console.log("function mapData");}
    // La variable `f` contiene todos los markers del mapa, cada uno con sus propiedades asociadas: 
    // título, descripción, etc.
    features = f;
     // Ahora se añaden los markers al mapa.  
    markerLayer = mapbox.markers.layer().features(features).factory(function(f) {
        var elem = mapbox.markers.simplestyle_factory(f);
        // Y una acción asociada al evento `mouse click on marker` La barra lateral izquierda se rellenará
        // con todos los datos del marker o del edificio abandonado seleccionado por el usuario.
        MM.addEvent(elem, 'click', function(e) { 
            var imagen='';
            var masinfo='';
            var descripcion='';
            var direccion='';       

            var titulo = '<h2>' + f.properties.titulo + '</h2>'
            $('#contentDetail').removeClass('inactivo').addClass('activo'); 
            $('#contentDetail').html('');
            $('#contentDetail').append('<a class="closeWindow" href="#">&#10006;</a><script> $(".closeWindow").click(function(){ $("#contentDetail").removeClass("activo").addClass("inactivo"); return false; });</script>'); 
            $('#contentDetail').append('<h1 class="map-title"><span class="element-invisible">#DisponibleEnCordoba</span></h1>');
            $('#contentDetail').append(titulo); 
            if( f.properties.direccion  != ''){
                direccion = '<h3>' + f.properties.direccion + '</h3>';
                $('#contentDetail').append(direccion); 
            }
            if( f.properties.enlace != ''){
                imagen = '<div class="imagen"><img src="' + f.properties.enlace + '" alt="' + f.properties.titulo + '"></div>';
                $('#contentDetail').append(imagen);
            }
            if( f.properties.descripcion != ''){
                descripcion =  '<p>' + f.properties.descripcion + '</p>';
                $('#contentDetail').append(descripcion);
            }
            if( f.properties.referencia != ''){
                referencia =  '<p><em>Referencia catastral:</em></br> <a href="https://www1.sedecatastro.gob.es/OVCFrames.aspx?TIPO=consulta">' + f.properties.referencia + '</a></p>';
                $('#contentDetail').append(referencia);
            }
            if( f.properties.masinfo != ''){
                masinfo = '<a href="' + f.properties.masinfo + '">Enlace externo</a>';
                $('#contentDetail').append(masinfo);
            }
            $('#contentDetail').append('<p class="footer"><a href="http://colaborativa.eu"> Colaborativa.eu</a> 2013. Datos abiertos con licencia <a href="http://opendatacommons.org/licenses/odbl/">ODC-ODbL</a>. Textos e imágenes de la web con licencia <a href="http://creativecommons.org/licenses/by/2.0/es/">CC-BY-SA 2.0.</a></p>');
          });
        return elem;
    });
    
    // Añadir la capa de interacción definida al mapa.
    interaction = mapbox.markers.interaction(markerLayer);
    map.addLayer(markerLayer);
    
    // Definir una capa interactiva por defecto a cada marker que mostrará la dirección y el título 
    // cuando se active el evento `mouse over` de cada marker.
    interaction.formatter(function (feature) {
        var direccion='';       
        if( feature.properties.direccion  != ''){
            direccion = '<h3>' + feature.properties.direccion + '</h3>';
        }
        var o = '<h2>' + feature.properties.titulo + '</h2>' + direccion;
        return o;
    });
    // Llamada a la función `download_data` definida más abajo.
    download_data();
}
// La función `download_data` introducirá los enlaces a los datos abiertos en formato CSV y JSON en el HTML.
// Utiliza la variable `data_id definida al comienzo para obtener los datos de **Google Drive SpreadSheet**.
function download_data() {
     if( DEBUG_MAP) {console.log("function download_data");}
    // La llamada URL para formato `CSV` es:
    $('#download_csv').attr('href', 'https://docs.google.com/spreadsheet/pub?key=' + data_id + '&output=csv');
    // La llamada URL para formato `JSON` es:
    $('#download_json').attr('href', 'https://spreadsheets.google.com/feeds/list/' + data_id + '/od6/public/values?alt=json-in-script');
}
});
