;(function( App, CtlIdb, CtlIdbKvStore ){

    /// Constants: -------------------------------------------------------------

    var DBNAME =    "worldradioplayer";
    var DBVERSION = 3;

    /// Exports: ---------------------------------------------------------------

    App.Db = CtlIdb.connect(
        DBNAME,
        DBVERSION,
        {
            settings:   CtlIdbKvStore,
            stations:   App.DbStations,
        },
        createSchema );

    /// Functions: -------------------------------------------------------------

    function createSchema( db, oldVersion, newVersion ) {

        if ( oldVersion < 2 ) {
            
            CtlIdbKvStore.create( db, "settings" );

        } 
        if ( oldVersion < 3 ) {

            CtlIdbKvStore.create( db, "stations" );
        }
    };

})( window.App, window.CtlIdb, window.CtlIdbKvStore );
