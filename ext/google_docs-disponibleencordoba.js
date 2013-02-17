//
//
// https://github.com/Rub21/ayacucho/blob/gh-pages/ext/google_docs.js
// https://github.com/ded/reqwest
// http://mapbox.com/blog/mapbox-fusion-tables-drones/
//
var DEBUG_GOOGLE = 0;
function mmg_google_docs_spreadsheet_1(id, callback) {
    if( DEBUG_GOOGLE) { console.log("function mmg_google_docs_spreadsheet_1");}
    if (typeof reqwest === 'undefined'){
        console.log("CSV: reqwest required for mmg_csv_url");
    }

    function response(x) {
        if( DEBUG_GOOGLE) { console.log("function response");}
        var features = [],
            latfield = '',
            lonfield = '';
        if (!x || !x.feed) return features;
        for (var f in x.feed.entry[0]) {
            if (f.match(/\$Lat/i)){
                latfield = f;                    
            }
            if (f.match(/\$Lon/i)){
                lonfield = f;     
            }
        }

        for (var i = 0; i < x.feed.entry.length; i++) {                             
            var entry = x.feed.entry[i];
            //console.log(entry);
            var feature = {
                geometry: {
                    type: 'Point',
                    coordinates: []
                },
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
            for (var y in entry) {
                if (y === latfield){
                    feature.geometry.coordinates[1] = parseFloat(entry[y].$t);
                    //console.log("coordinate latfield "+ feature.geometry.coordinates[1]); 
                }
                else if (y === lonfield) {
                    feature.geometry.coordinates[0] = parseFloat(entry[y].$t);
                    //console.log("coordinate lonfield "+ feature.geometry.coordinates[0]); 
                }
                else if (y.indexOf('gsx$') === 0) {                            
                    feature.properties[y.replace('gsx$', '')] = entry[y].$t;
                }
            }
            
            if (feature.geometry.coordinates.length == 2){
                 features.push(feature);
                 //console.log("feature.geometry.coordinates"+feature.geometry.coordinates.length);
            }
            //console.log(features);
           /* _.each(feature, function(value, key) {
                if(feature.properties['categoria']=="Robo"){ feature.properties['marker-color']='#CB3344'} 
                if(feature.properties['categoria']=="Intento de Robo") {feature.properties['marker-color']='#FFCC33'}
                if(feature.properties['categoria']=="Agresión") { feature.properties['marker-color']='#653332'}   
            }); */
        }
        return callback(features);
    }
    var url = 'http://spreadsheets.google.com/feeds/list/' +
        id + '/od6/public/values?alt=json-in-script&callback=callback';
    //console.log(url);
    reqwest({
        url: url,
        type: 'jsonp',
        jsonpCallback: 'callback',
        success: response,
        error: response
    });
    // problem when browser needs to add security exceptio for this request
}

