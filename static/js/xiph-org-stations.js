;(function( _, App, ObjectFsXhrJson, ObjectFsWithCached, ObjectFsAsyncObject ){

    /// Constants: -------------------------------------------------------------

    var XIPH_URL =  "/static/data/dir.xiph.org.yp.json";

    /// Exports: ---------------------------------------------------------------

    App.XiphOrgStations = ObjectFsWithCached(
        ObjectFsAsyncObject,
        loadStations );

    /// Functions: -------------------------------------------------------------

    function loadStations( cb ) {

        loadJson( getStations );

        function getStations( err, streams ) {
            
            if ( err || !streams || !streams.reduce ) {
                cb( err || "Empty result.", streams );
            } else {
                cb( err, streams.reduce( streamsToStations, {} ));
            }
        };
    };

    function streamsToStations( stations, stream ) {
        
        var is_supported = App.SoundPlayer.isStreamSupported({ type: stream.server_type });
        
        if ( is_supported ) {
            var id = stream.server_name;

            if ( !stations[id] ){
                stations[id] = {
                    name:       stream.server_name,
                    genre:      stream.genre,
                    streams:    [],
                };
            }
            stations[id].streams.push({
                type:       stream.server_type,
                bitrate:    parseInt( stream.bitrate, 10 ) || 0,
                url:        stream.listen_url,
            });
        }

        return stations;
    };

    function loadJson( cb ) {

        ObjectFsXhrJson.read( XIPH_URL, onLoad );

        function onLoad( err, result ) {
            cb( err, result && result.directory && result.directory.entry );
        };
    };


})( window._, window.App, ObjectFsXhrJson, ObjectFsWithCached, ObjectFsAsyncObject );
