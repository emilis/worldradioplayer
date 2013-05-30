;(function( _, App, CtlIdb, CtlIdbKvStore ){

    /// Constants: -------------------------------------------------------------

    var DBNAME =    "worldradioplayer";
    var DBVERSION = 2;

    /// Exports: ---------------------------------------------------------------

    App.Db = CtlIdb.connect(
        DBNAME,
        DBVERSION,
        {
            settings:   CtlIdbKvStore,
        },
        createSchema );

    /// Functions: -------------------------------------------------------------

    function createSchema( db, oldVersion, newVersion ) {

        if ( oldVersion < 2 ) {

            CtlIdbKvStore.create( db, "settings" );
        } else {

            /*
            var store = db.createObjectStore( "stations", { autoIncrement: true });
            store.createIndex( "name",   "name" );
            store.createIndex( "genre",  "genre" );
            store.createIndex( "domain", "domain" );
            store.createIndex( "songs_played", "songs_played" );

            ObjectFsXhrJson.list( "/static/js/data/xiph.org.stations.json", null, null, createStations );
            */
        }

        function createStations( err, stations ) {
            
            if ( err ) {
                store.transaction.abort();
            } else {
                _.each( stations, addStation );
            }
        };

        function addStation( station ) {
            store.put( station );
        }
    };


})( window._, window.App, window.CtlIdb );
