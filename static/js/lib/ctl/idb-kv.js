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
        window.ObjectFsUtils

    Author:     Emilis Dambauskas <emilis.d@gmail.com>.

    License:    GNU AFFERO GENERAL PUBLIC LICENSE Version 3 or later.
                http://www.gnu.org/licenses/agpl.html

    Note:       CTL == Cheap Tricks Library.

------------------------------------------------------------------------------*/

;(function( window, CtlIdb, ObjectFsUtils ){

    /// Exports ----------------------------------------------------------------

    window.CtlIdbKvStore =          connect;
    window.CtlIdbKvStore.create =   create;

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
            withStore( CtlIdb.OP_READ, function readBody( err, store ){

                if ( err ) {
                    return callback( err, null );
                }

                var req =       store.get( key );
                req.onsuccess = readOnSuccess;
                req.onerror =   readOnError;
                
                function readOnSuccess() {
                    callback( null, req.result );
                };
                function readOnError() {
                    callback && callback( req.error );
                };
            });
        }

        function write( key, value, callback ) {
            withStore( CtlIdb.OP_WRITE, function writeBody( err, store ){

                if ( err ) {
                    return callback( err, null );
                }

                var req =       store.put( value, key );
                req.onerror =   writeOnError;
                req.onsuccess = writeOnSuccess;
                
                function writeOnSuccess() {
                    callback && callback( null, req );
                };
                function writeOnError() {
                    callback && callback( req.error );
                };
            });
        }

        function remove( key, callback ) {
            withStore( CtlIdb.OP_WRITE, function removeBody( err, store ){

                if ( err ) {
                    return callback( err, null );
                }

                var req =       store.delete( key );
                req.onerror =   removeOnError;
                req.onsuccess = removeOnSuccess;

                function removeOnSuccess() {
                    callback && callback( null, req );
                };
                function removeOnError() {
                    callback && callback( req.error );
                };
            });
        }

        function clear( callback ) {
            withStore( CtlIdb.OP_WRITE, function clearBody( err, store ){

                if ( err ) {
                    return callback( err, null );
                }

                var req =       store.clear();
                req.onerror =   clearOnError;
                req.onsuccess = clearOnSuccess;
                
                function clearOnSuccess() {
                    callback && callback( null, req );
                };
                function clearOnError() {
                    callback && callback( req.error );
                };
            });
        }

        function count( callback ) {
            withStore( CtlIdb.OP_READ, function countBody( err, store ) {

                if ( err ) {
                    return callback( err, null );
                }

                var req =       store.count();
                req.onsuccess = countOnSuccess;
                req.onerror =   countOnError;
                
                function countOnSuccess() {
                    callback( null, req.result );
                };
                function countOnError() {
                    callback( req.error );
                };
            });
        }

        function list( filter, options, callback ) {
            withStore( CtlIdb.OP_READ, function listBody( err, store ){

                if ( err ) {
                    return callback( err, null );
                }

                var results =   [];
                var filterFn =  ObjectFsUtils.itemFilter( filter );
                var offset =    ( options && options.offset ) || 0;
                var limit =     ( options && options.limit  ) || Infinity;
                var count =     0;

                var req =       store.openCursor();
                req.onsuccess = listOnSuccess;
                req.onerror =   listOnError;

                function listOnSuccess() {
                    var cursor = req.result;
                    if (!cursor) {
                        callback( null, ObjectFsUtils.applyOptions( results, options ));
                        return;
                    } else {
                        count++;
                        if ( filterFn( cursor.value ) && count > offset ) {
                            results.push( cursor.value );
                        }
                        if ( results.length >= limit ) {
                            callback( null, results );
                            return;
                        } else {
                            cursor.continue();
                        }
                    }
                };

                function listOnError() {
                    callback( req.error, results );
                };
            });
        }
    };  /// end of connect()

}( window, window.CtlIdb, window.ObjectFsUtils ));
