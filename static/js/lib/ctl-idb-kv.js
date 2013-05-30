/*  ----------------------------------------------------------------------------

    Key-Value store type driver for CtlIdb.

    Usage:
        /// Provide methods for some store:
        var myDb = CtlIdb.connect( db_name, db_version, {
            store1: CtlIdbKvStore,
        }, createSchema );
        
        myDb.store1.write( "foo", "bar", console.log );
        myDb.store1.read( "foo", console.log );
        
        function createSchema( db, oldVersion, newVersion ) {
            ...
            CtlIdbKvStore.create( db, "my_store_name" );
        }

    Dependencies:
        window.CtlIdb

    Author:     Emilis Dambauskas <emilis.d@gmail.com>.

    License:    GNU AFFERO GENERAL PUBLIC LICENSE Version 3 or later.
                http://www.gnu.org/licenses/agpl.html

    Note:       CTL == Cheap Tricks Library.

------------------------------------------------------------------------------*/

;(function( CtlIdb ){

    /// Exports ----------------------------------------------------------------

    CtlIdbKvStore =        connect;
    CtlIdbKvStore.create = create;

    /// Functions: -------------------------------------------------------------

    function create( db, store_name ) {

        return db.createObjectStore( store_name );
    };

    function connect( withStore ) {

        return {
            read:       read,
            write:      write,
            remove:     remove,
            list:       list,
            count:      count,
            clear:      clear,
        };


        function read( key, callback ) {
            withStore( CtlIdb.OP_READ, function getItemBody( store ){

                var req =       store.get( key );
                req.onsuccess = readOnSuccess;
                req.onerror =   readOnError;
                
                function readOnSuccess() {
                    callback( null, req.result );
                };
                function readOnError() {
                    console.error( 'Error in Storage.getItem(): ', req.error.name );
                    callback && callback( req.error );
                };
            });
        }

        function write( key, value, callback ) {
            withStore( CtlIdb.OP_WRITE, function setItemBody( store ){

                var req =       store.put( value, key );
                req.onerror =   writeOnError;
                req.onsuccess = writeOnSuccess;
                
                function writeOnSuccess() {
                    callback && callback( null, req );
                };
                function writeOnError() {
                    console.error( 'Error in Storage.setItem(): ', req.error.name );
                    callback && callback( req.error );
                };
            });
        }

        function remove( key, callback ) {
            withStore( CtlIdb.OP_WRITE, function removeItemBody( store ){

                var req =       store.delete( key );
                req.onerror =   removeOnError;
                req.onsuccess = removeOnSuccess;

                function removeOnSuccess() {
                    callback && callback( null, req );
                };
                function removeOnError() {
                    console.error( 'Error in Storage.removeItem(): ', req.error.name );
                    callback && callback( req.error );
                };
            });
        }

        function clear( callback ) {
            withStore( CtlIdb.OP_WRITE, function clearBody( store ){

                var req =       store.clear();
                req.onerror =   clearOnError;
                req.onsuccess = clearOnSuccess;
                
                function clearOnSuccess() {
                    callback && callback( null, req );
                };
                function clearOnError() {
                    console.error( 'Error in Storage.clear(): ', req.error.name );
                    callback && callback( req.error );
                };
            });
        }

        function count( callback ) {
            withStore( CtlIdb.OP_READ, function lengthBody( store ) {

                var req =       store.count();
                req.onsuccess = countOnSuccess;
                req.onerror =   countOnError;
                
                function countOnSuccess() {
                    callback( null, req.result );
                };
                function countOnError() {
                    console.error( 'Error in Storage.length(): ', req.error.name );
                    callback( req.error );
                };
            });
        }

        function list( filter, options, callback ) {
            withStore( CtlIdb.OP_READ, function listBody( store ){

                var results =   [];
                var req =       store.openCursor();
                req.onsuccess = listOnSuccess;
                req.onerror =   listOnError;

                function listOnSuccess() {
                    var cursor = req.result;
                    if (!cursor) {
                        callback( null, results );
                        return;
                    } else {
                        results.push( cursor.value );
                        cursor.continue();
                    }
                };

                function listOnError() {
                    callback( req.error, results );
                };
            });
        }
    };  /// end of connect()

}( window.CtlIdb ));

