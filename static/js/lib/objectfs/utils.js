;(function( window, _ ){

    /// Exports: --------------------------------------------------------------

    window.ObjectFsUtils = {
        filterItems:    filterItems,
        itemFilter:     itemFilter,
        applyOptions:   applyOptions,
    };

    /// Functions: ------------------------------------------------------------

    /**
     *
     */
    function filterItems( items, filter, options ) {
        options =       options || {};
        
        var results =   [];

        if ( filter ) {
            results =   items.filter( itemFilter( filter ));
        } else {
            results =   items;
        }

        return applyOptions( results, options );
    };

    /**
     *
     */
    function itemFilter( filters ) {
        return function( item ) {

            if ( !filters ) {
                return true;
            } else if ( !item ) {
                return false;
            } else if ( filters instanceof Function ) {
                return filters( item );
            } else {
                return _.reduce( filters, checkFields, true );
            }
            
            function checkFields( result, filter, key ){
                if ( !result ) {
                    return result;
                } else if ( filter instanceof RegExp ) {
                    return filter.exec( item[key] );
                } else if ( filter instanceof Function ) {
                    return filter( item[key], key, item );
                } else if ( filter instanceof Array) {
                    return ( -1 !== filter.indexOf( item[k] ));
                } else {
                    return ( filter === item[key] );
                }
            };
        };
    };

    /**
     *
     */
    function applyOptions( results, options ) {

        if ( !options || !results || !results.length ) {
            return results;
        }

        if ( options.offset ) {
            results =   results.slice( options.offset );
        }

        if ( options.limit ) {
            results =   results.slice( 0, options.limit );
        }

        return results;
    };


})( window, window._ );
