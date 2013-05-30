/*  ----------------------------------------------------------------------------

    CTL Indexed Database API wrapper.

    Usage:
        var myDb = CtlIdb.connect( "db_name", VERSION, {
            store1: fnStoreType,
            ...
            }, fnCreateSchema );

        myDb.store1.doSomething( ... );

        function fnCreateSchema( db, oldVersion, newVersion ) {
            ...
        };
       
        /// You should probably use some library instead of your own function:
        function fnStoreType( withStore ){
            ...
            return {
                doSomething: function( ... ){
                    withStore( CtlIdb.OP_READ, function( store ) {
                        ...
                    });
                },
                ...
            };
        };
    
    Author:     Emilis Dambauskas <emilis.d@gmail.com>.

    License:    GNU AFFERO GENERAL PUBLIC LICENSE Version 3 or later.
                http://www.gnu.org/licenses/agpl.html

    Note:       CTL == Cheap Tricks Library.

----------------------------------------------------------------------------- */

;(function( window ){

    /// Constants: -------------------------------------------------------------

    var OP_READ =   "readonly";
    var OP_WRITE =  "readwrite";

    /// Exports: ---------------------------------------------------------------

    window.CtlIdb = {
        connect:        connect,
        OP_READ:        OP_READ,
        OP_WRITE:       OP_WRITE,
    };

    /// Functions: -------------------------------------------------------------

    function connect( db_name, db_version, stores, createSchema ) {

        var db;

        var exports = {
            withStore:  withStore,
        };
        for ( var k in stores ) {
            exports[k] = stores[k]( withStore.bind( null, k ));
        };

        return exports;

        function withStore( store_name, op_type, cb ) {

            if ( db ) {
                withStoreDone();
            } else {
                var openreq =               window.indexedDB.open( db_name, db_version );
                openreq.onerror =           withStoreOnError;
                openreq.onupgradeneeded =   withStoreOnUpgradeNeeded;
                openreq.onsuccess =         withStoreOnSuccess;
            }

            function withStoreDone() {
                cb( db.transaction( store_name, op_type ).objectStore( store_name ));
            };
            function withStoreOnError() {
                console.error( "Storage: can't open database:", openreq.error.name );
            };
            function withStoreOnUpgradeNeeded( evt ) {
                debug( "upgrade needed." );
                createSchema( openreq.result, evt.oldVersion, evt.newVersion );
            };
            function withStoreOnSuccess() {
                db =    openreq.result;
                debug( "open withStore success:", db );
                withStoreDone();
            }
        };
    };

    function debug() {

        console.log.apply( console, arguments );
    };

})( window );
