;(function( _, App ){

    /// Constants: -------------------------------------------------------------

    var IMPORTED =      "imported";
    var IMPORT_DELAY =  5000;

    /// Variables: -------------------------------------------------------------
    
    var targetWrapper = ObjectFsLocalTable;

    /// Exports: ---------------------------------------------------------------

    App.Db = connect();

    /// Functions: -------------------------------------------------------------

    function connect() {

        var exports = {
            settings:   targetWrapper( "settings" ),
            last:       targetWrapper( "last-played" ),
        };

        if ( exports.settings.read( IMPORTED )) {
            return _.extend( exports, {
                stations:   targetWrapper( "stations" ),
                genres:     targetWrapper( "genres" ),
                words:      targetWrapper( "words" ),
            });
        } else {
            localStorage.clear();
            return _.extend( exports, importData() );
        }
    };

    function importData() {

        var stations =  App.XiphOrgStations;

        var wrappers = {
            stations:   stations,
            genres:     wrapReducedList( stations, stationsToGenres ),
            words:      wrapReducedList( stations, stationsToWords ),
        };

        /// Save data to localStorage after some time:
        setTimeout( saveImported, IMPORT_DELAY, wrappers );

        return wrappers;
    };

    /// Reducers: --------------------------------------------------------------

    function stationsToGenres( genres, station ) {
        
        _.isString( station.genre ) && _.forEach( getWordScores( station.genre ), addGenre );
        return genres;

        function addGenre( score, name ) {
            genres[name] = genres[name] || {};
            genres[name][ station.name ] = score;
        };
    };

    function stationsToWords( words, station ) {

        _.isString( station.name ) && _.forEach( getWordScores( station.name ), addWord );
        return words;

        function addWord( score, name ) {
            words[name] = words[name] || {};
            words[name][ station.name ] = score;
        };
    };

    function getWordScores( str ) {
        if ( !_.isString( str )) {
            return {};
        }

        str =           str.toLowerCase();
        var len =       str.length;
        var scores =    {};

        str.split(/[^a-z0-9]+/g).forEach( addWord );
        return scores;

        function addWord( word ) {
            scores[ word ] = (( len - str.indexOf( word )) + 0.5 * word.length ) / len;
        };
    };

    /// Other functions: -------------------------------------------------------

    function saveImported( wrappers ) {
        console.log( "saveImported", this, Object.keys( wrappers ), arguments.length );

        var left = Object.keys( wrappers ).length;
        _.forEach( wrappers, saveStorage );

        function saveStorage( wrapper, name ) { 
            console.log( "saveStorage", left, name, Object.keys( wrapper ));

            wrapper.toObject( saveToTarget );
            
            function saveToTarget( err, obj ) {
                console.log( "saveToTarget", left, name, err, Object.keys( obj ).length );
               
                if ( !err ) {
                    var target = targetWrapper( name );
                    target.clear();
                    try {
                        _.forEach( obj, saveRecord );
                    } catch ( e ) {
                        console.error( e, e.toString() );
                    }
                    left -= 1;
                    !left && importDone();
                }
                
                function saveRecord( value, key ) {
                    key && target.write( key, value );
                };
            };
        };
    };

    function importDone() {
        App.debug( "importDone" );
        
        App.Db.settings.write( IMPORTED, true );
    };

    /**
     *  Creates an async ObjectFs wrapper from a reduced list from another async wrapper.
     */
    function wrapReducedList( wrapper, reducer ) {
        
        return ObjectFsWithCached( ObjectFsAsyncObject, asyncList );

        function asyncList( cb ) {
            
            wrapper.list( null, null, onList );
            
            function onList( err, list ){
                if ( err || !list || !list.reduce ){
                    cb( err || "Empty list.", list );
                } else {
                    cb( err, list.reduce( reducer, {} ));
                }
            };
        };
    };

})( window._, window.App );
