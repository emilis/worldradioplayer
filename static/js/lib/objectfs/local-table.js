;(function( window, _, ObjectFsUtils ){

    /// Variables: -------------------------------------------------------------

    var LS =    window.localStorage;

    /// Exports: ---------------------------------------------------------------

    window.ObjectFsLocalTable = connect;

    /// Functions: -------------------------------------------------------------

    function connect( name ) {

        if ( !_.isString( name ) || _.isEmpty( name )) {
            throw Error( "ObjectFsLocalTable: table name must be a non-empty string." );
        }

        name = "---" + name + "---";

        return {
            read:       read,
            write:      write,
            remove:     remove,
            list:       list,
            listIds:    listIds,
            listByIds:  listByIds,
            count:      count,
            clear:      clear,
            toObject:   toObject,
        };


        function getId( id ) {

            return name + id;
        };


        function read( id, cb ) {
            if ( !id ) {
                if ( _.isFunction( cb )) {
                    cb( Error( "ObjectFsLocalTable.read() needs a non-empty id." ));
                } else {
                    throw Error( "ObjectFsLocalTable.read() needs a non-empty id." );
                }
            }
            id = getId( id );

            var record = LS.getItem( id );
            if ( record === undefined ) {
                _.isFunction( cb ) && cb( "Not found.", record );
            } else {
                record = JSON.parse( record );
                _.isFunction( cb ) && cb( null, record );
            }
            return record;
        };

        
        function write( id, record, cb ) {
            id = getId( id );

            try {
                LS.setItem( id, JSON.stringify( record ));
                cb && cb( null, id );
                return id;
            } catch ( e ) {
                cb && cb( e, false );
                return false;
            }
        };


        function remove( id, cb ) {
            id = getId( id );

            var exists = ( LS.getItem( id ) !== undefined );
            LS.removeItem( id );
            cb && cb( null, exists );
            return exists;
        };

        function list( filter, options, cb ) {

            var keys =  getKeys();
            var all =   [];

            for ( var i=0,len=keys.length; i<len; i++ ) {
                all.push( JSON.parse( LS.getItem( keys[i] )));
            }

            var results = ObjectFsUtils.filterItems( all, filter, options );
            
            cb && cb( null, results );
            return results;
        };

        function listIds( cb ) {

            var results = getKeys().map( toPublicId );
            cb && cb( null, results);
            return results;
        }

        function listByIds( ids, cb ) {

            var results = _( ids ).map( read ).filter().value();
            cb && cb( null, results );
            return results;
        };

        function count( filter, options, cb ) {

            var count = 0;

            if ( !filter && !options ) {
                count = getKeys().length;
            } else {
                count = list( filter, options ).length;
            }

            cb && cb( null, count );
            return count;
        };

        function clear( cb ) {
            
            try {
                getKeys().map( function( k ){ LS.removeItem( k )});
                cb && cb( null, true );
                return true;
            } catch ( e ) {
                cb && cb( e );
                return false;
            }
        };

        function toObject( cb ) {
            
            var result = getKeys().reduce( addRecord, {} );
            cb && cb( null, result );
            return result;

            function addRecord( obj, key ) {
                if ( key && key.replace ) {
                    obj[ key.replace( name, "" )] = JSON.parse( LS.getItem( key ));
                }
                return obj;
            };
        };

        function getKeys() {

            return _.filter( Object.keys( LS ), tableKey )
        };

        function tableKey( key ) {
            return key.indexOf( name ) === 0;
        };

        function toPublicId( id ) {
            if ( id.indexOf( name )){
                return id;
            } else {
                return id.substr( name.length );
            }
        };
    };


})( window, window._, window.ObjectFsUtils );
