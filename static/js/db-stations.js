;(function( App, CtlIdb, CtlIdbKvStore, ObjectFsXhrJson ){

    /// Constants: -------------------------------------------------------------

    var STATION_JSON =  "/static/js/data/xiph.org.stations.json";

    /// Exports: ---------------------------------------------------------------

    App.DbStations = stationStore;

    /// Functions: -------------------------------------------------------------

    function stationStore( withStore ) {

        var done;
        var error;
        var loading;
        var waiting = [];

        return CtlIdbKvStore( withStations );

        function withStations( type, cb ) {

            if ( error ) {
                cb( error, null );
            } else if ( done ) {
                withStore( type, cb );
            } else {
                waiting.push( arguments );
                if ( !loading ) {
                    loading = true;
                    withStore( CtlIdb.OP_READ, countStations );
                }
            }
        }

        function resolveWaiting( err ) {
           
            if ( err ) {
                error = err;
            } else {
                done =  true;
            }
            loading =   false;
            for ( var i=0,len=waiting.length; i<len; i++ ) {
                withStations.apply( null, waiting[i] );
            }
        };

        function countStations( err, store ) {

            if ( err ) {
                return resolveWaiting( err );
            }

            var req =       store.count();
            req.onsuccess = countOnSuccess;
            req.onerror =   countOnError;
            
            function countOnSuccess() {
                if ( req.result ) {
                    resolveWaiting();
                } else {
                    downloadStations();
                }
            };
            function countOnError() {
                resolveWaiting( req.error );
            }
        };

        function downloadStations() {
            
            ObjectFsXhrJson.list( STATION_JSON, null, null, createStations );
        };

        function createStations( err, stations ) {

            if ( err ) {
                return resolveWaiting( err );
            } else if ( !stations.length ) {
                return resolveWaiting( Error( "Downloaded an empty station list." ));
            } else {
                withStore( CtlIdb.OP_WRITE, saveStations );
            }
            
            function saveStations( err, store ) {

                if ( err ) {
                    return resolveWaiting( err );
                }

                for ( var i=0,len=stations.length; i<len; i++ ) {
                    store.put( stations[i], stations[i].name );
                }
                resolveWaiting();
            };  /// end of saveStations
        };  /// end of createStations
    };  /// end of stationStore

})( window.App, window.CtlIdb, window.CtlIdbKvStore, window.ObjectFsXhrJson );

