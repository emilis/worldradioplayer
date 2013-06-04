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
            read:   read,
            write:  write,
            remove: remove,
            list:   list,
        };


        function getId( id ) {

            return name + id;
        };


        function read( id, cb ) {
            id = getId( id );

            var record = LS[ id ];
            if ( record &&  record.length ) {
                record = JSON.parse( record );
            };
            cb && cb( record !== undefined, record );
            return record;
        };

        
        function write( id, record, cb ) {
            id = getId( id );

            try {
                LS[ id ] = JSON.stringify( record );
                cb && cb( null, id );
                return id;
            } catch ( e ) {
                cb && cb( e, false );
                return false;
            }
        };


        function remove( id, cb ) {
            id = getId( id );

            var exists = LS[ id ] !== undefined;
            LS.removeItem( id );
            cb && cb( null, exists );
            return exists;
        };

        function list( filter, options, cb ) {

            var keys =  _.filter( Object.keys( LS ), tableKey );
            var all =   [];

            for ( var i=0,len=keys.length; i<len; i++ ) {
                all.push( JSON.parse( LS[ keys[ i ]]));
            }

            var results = ObjectFsUtils.filterItems( all, filter, options );
            
            cb && cb( null, results );
            return results;
        };

        function tableKey( key ) {
            return key.indexOf( name ) === 0;
        };
    };


})( window, window._, window.ObjectFsUtils );
