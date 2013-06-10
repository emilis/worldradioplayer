
;(function( window, _ ){

    /// Exports: ---------------------------------------------------------------

    window.ObjectFsAsyncObject = connect;

    /// Functions: -------------------------------------------------------------

    function connect( withObject ) {

        /// Exports: -----------------------------------------------------------

        return {
            read:       wrapFunction( read ),
            write:      wrapFunction( write ),
            remove:     wrapFunction( remove ),
            list:       wrapFunction( list ),
            listIds:    wrapFunction( listIds ),
            listByIds:  wrapFunction( listByIds ),
            count:      wrapFunction( count ),
            toObject:   wrapFunction( toObject ),
        };

        function wrapFunction( fn ) {
            return function() {
                
                var args = _.toArray( arguments );
                withObject( callFn );
                
                function callFn( err, dataObject ) {

                    if ( err ) {
                        var cb = args.pop();
                        _.isFunction( cb ) && cb( err, dataObject );
                    } else {
                        fn.apply( dataObject, args );
                    }
                };
            };
        };
    };

    function read( id, cb ) {
        if ( !id ) {
            if ( _.isFunction( cb )) {
                cb( Error( "ObjectFsAsyncObject.read() requires a non-empty id." ));
            } else {
                throw Error( "ObjectFsAsyncObject.read() requires a non-empty id." );
            }
            return false;
        }

        var record = this[ id ];
        if ( record !== undefined ) {
            cb( null, record );
        } else {
            cb( "Not found.", record );
        }
    };


    function write( id, record, cb ) {

        this[id] = record;
        cb( null, record );
    };


    function remove( id, cb ) {

        var record =    this[ id ];
        if ( record === undefined ) {
            cb( "Not found.", record );
        } else {
            delete this[id];
            cb( null, record );
        }
    };

    function list( filter, options, cb ) {

        try {
            var results =   _.values( this );
            if ( filter ) {
                results =   results.filter( ObjectFsUtils.itemFilter( filter ));
            } 
            if ( options ) {
                results =   ObjectFsUtils.applyOptions( results, options );
            }
            cb && cb( null, results );
        } catch ( e ) {
            cb && cb( e, results );
        }
    };

    function listIds( cb ) {
        
        var results = _.keys( this );
        cb && cb( null, results );
        return results;
    };

    function listByIds( ids, cb ) {

        var results = _.at( this, ids );
        cb && cb( null, results );
        return results;
    };

    function count( filter, options, cb ) {

        list.call( this, filter, options, function( err, results ){
            cb( err, results && results.length );
        });
    };

    function toObject( cb ) {
        cb && cb( null, this );
        return this;
    };


})( window, window._ );
