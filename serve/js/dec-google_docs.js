//     dec-google_docs.js 1.0 under MIT license
//     
//     2013  (c) colaborativa.eu and contributors
//     http://colaborativa.eu/proyectos/disponible-en-cordoba/
//
//     Desarrollo basado en:
//      - https://github.com/Rub21/ayacucho/

// Definición variables globales
// ------------------------------
var DEBUG_GOOGLE = 0;

// Función Auxiliar
// --------------------
// Esta función extrae la información de la spreadsheet de Google Drive con el `id` especificado. 
// Al concluir invocará a la callback especificada como argumento de entrada.
function mmg_google_docs_spreadsheet_1(id, callback) {
    if( DEBUG_GOOGLE) { console.log("function mmg_google_docs_spreadsheet_1");}
    // Chequear que `reqwest` existe para así poder comunicarnos con Google Drive.
    if (typeof reqwest === 'undefined'){
        console.log("CSV: reqwest required for mmg_csv_url");
    }
    // La función `response` se ejecutará una vez concluída la llamada a `reqwest` invocada más abajo.
    // Se encargará de extraer cada fila de la spreadsheet, localizar cada columna (título, dirección, etc.)
    // y almacenar todos los datos en la variable array `features`.
    function response(x) {
        if( DEBUG_GOOGLE) { console.log("function response");}
        var features = [],
            latfield = '',
            lonfield = '';
        // Chequear que los datos son válidos antes de continuar.
        if (!x || !x.feed) return features;
        for (var f in x.feed.entry[0]) {
            if (f.match(/\$Lat/i)){
                latfield = f;                    
            }
            if (f.match(/\$Lon/i)){
                lonfield = f;     
            }
        }
        // Bucle for para cada fila de la spreadsheet, que corresponde con un edificio abandonado.
        for (var i = 0; i < x.feed.entry.length; i++) {                             
            var entry = x.feed.entry[i];
            var feature = {
                geometry: {
                    type: 'Point',
                    coordinates: []
                },
                // Obtener cada columna de la fila actual en formato texto.
                properties: {
                    'marker-color':'#0d5ca8',
                    'titulo': entry['gsx$titulo'].$t,
                    'direccion': entry['gsx$direccion'].$t,
                    'descripcion': entry['gsx$descripcion'].$t,  
                    'estado': entry['gsx$estado'].$t,
                    'enlace': entry['gsx$enlace'].$t,  
                    'categoria': entry['gsx$categoria'].$t, 
                    'masinfo': entry['gsx$masinfo'].$t,
                    'referencia': entry['gsx$referencia'].$t, 
                }
            };
            // Para la latitud y longitud es necesario convertir a float. 
            for (var y in entry) {
                if (y === latfield){
                    feature.geometry.coordinates[1] = parseFloat(entry[y].$t);
                }
                else if (y === lonfield) {
                    feature.geometry.coordinates[0] = parseFloat(entry[y].$t);
                }
                else if (y.indexOf('gsx$') === 0) {                            
                    feature.properties[y.replace('gsx$', '')] = entry[y].$t;
                }
            }
            
            if (feature.geometry.coordinates.length == 2){
                 features.push(feature);
            }
        }
        // Llamar a la función callback con el array `features` como dato de entrada.
        return callback(features);
    }
    // Definimos la URL con el ID de nuestra spreadsheet en Google Drive.
    var url = 'http://spreadsheets.google.com/feeds/list/' +
        id + '/od6/public/values?alt=json-in-script&callback=callback';
    // Llamada a `reqwest`, similar a ajax, para objeter los datos en formato JSON de la spreadsheet 
    // e invocar la callback `response` una vez finalizada.
    // Más información en: https://github.com/ded/reqwest
    reqwest({
        url: url,
        type: 'jsonp',
        jsonpCallback: 'callback',
        success: response,
        error: response
    });
    // Nota: algunos exploradores tienen restringido el acceso a ciertas Webs por motivos de seguridad. 
    // Google Drive es una de ellas. Si tenemos algún problema al realizar la llamada `reqwest` una manera de 
    // testear si el explorador está bloqueando las llamadas es directamente copiar y pegar la URL en el explorador, y observar 
    // los mensajes de salida.
}

