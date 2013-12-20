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
var map_id  = 'colaborativa.OSMCordoba';

// Creación e inicialización del objeto mapa
var map = L.mapbox.map('map', map_id, {gridControl: false});
map.setView({ lat: 37.885, lon: -4.79 }, 14);
    
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
     // Ahora se añaden los markers al mapa en formato GeoJSON.  
    var markerLayer = L.mapbox.markerLayer(features)
    .addTo(map);
    
    
    var mustacheTemplate = '<a class="closeWindow" href="#">&#10006;</a>' +
    '<script> $(".closeWindow").click(function(){ $("#contentDetail").removeClass("activo").addClass("inactivo"); return false; });</script>'+
    '<h1 class="map-title"><span class="element-invisible">#DisponibleEnCordoba</span></h1>'+
    '<h2>{{titulo}}</h2>'+
    '<h3>{{direccion}}</h3>'+
    '<script> if ("{{enlace}}" != ""){'+
    '$("#contentDetail h3").append("'+"<div class='imagen'><img src='{{enlace}}' alt='{{titulo}}''> </div>"+'");'+
    '}</script>'+
    '<p id="descripcion" >{{descripcion}}</p>'+
    '<script> if ("{{referencia}}" != ""){'+
    '$("#contentDetail #descripcion").append("' + "<p> <em>Referencia catastral:</em><br><a href='https://www1.sedecatastro.gob.es/OVCFrames.aspx?TIPO=consulta'>{{referencia}}</a> </p>"+'");'+
    '}</script>'+
     '<script> if ("{{masinfo}}" != "") {'+
    '$("#contentDetail #descripcion").append("'+"<p><a href='{{masinfo}}'>Enlace externo</a></p>"+'");'+
    '}</script>'+
    '<p class="footer">'+
    '<a href="http://colaborativa.eu"> Colaborativa.eu</a> 2013. Datos abiertos con licencia '+
    '<a href="http://opendatacommons.org/licenses/odbl/">ODC-ODbL</a>. Textos e imágenes de la web con licencia <a href="http://creativecommons.org/licenses/by/2.0/es/">CC-BY-SA 2.0.</a>'+
    '</p>';
    markerLayer.on('click', function(e) {
            e.layer.unbindPopup();
            $('#contentDetail').removeClass('inactivo').addClass('activo'); 
            $('#contentDetail').html('');
            var html = Mustache.to_html(mustacheTemplate, e.layer.feature.properties);
            $('#contentDetail').html(html);
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
