;(function( _, $, App ){

    /// Constants: -------------------------------------------------------------

    var NO_RESULTS = '<li class="warning">No stations found matching your criteria. Please change your search parameters and try again.</li>';

    /// Variables: -------------------------------------------------------------

    var $form;
    var $results;
    var stationList =   App.StationList();
    var genres =        App.Db.genres;
    var words =         App.Db.words;
    var stations =      App.Db.stations;
    var X =             window.goodJob;
    var onChangeTh =    _.throttle( onChange, 1000, { leading: false, trailing: true });

    /// Exports: ---------------------------------------------------------------

    App.Search = {
        search:     search,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        $form =     $( "#search-form" );
        $results =  $( "#search-results" ).append( stationList.getView() );

        $form.on( "change", "select", onChangeTh );
        $form.on( "keydown", "input", onChangeTh );
        $form.on( "change", "input", onChangeTh );
    };

    function onChange() {

        var genre = $form.find( "#search-genre" ).val();
        var query = $form.find( "#search-query" ).val();

        search( query, genre );
    };

    function search( query, genre ) {
        App.debug( "search", query, genre );

        stationList.anounceUpdate();

        if ( !query && !genre ) {
            updateResults( null, [] );
            return;
        } else {
            X.run({
                genre:      X.call( okCb( genres.read, {}), genre ),
                word:       X.call( okCb( words.read, {}), query ),
                ids:        X.callSync( getIds, genre && X.get( "genre" ), query && X.get( "word" )),
                stations:   X.call( stations.listByIds, X.get( "ids" )),
                update:     X.call( updateResults, null, X.get( "stations" )),
            });
        }

        function getIds( genre, word ) {
           
            var no_genre =  _.isEmpty( genre );
            var no_word =   _.isEmpty( word );
            App.debug( "search/getIds", no_genre, genre, no_word, word );

            if ( no_genre && no_word ) {
                return [];
            } else if ( no_word ) {
                return _( genre ).pairs().sortBy( 1 ).pluck( 0 ).value().reverse();
            } else if ( no_genre ) {
                return _( word ).pairs().sortBy( 1 ).pluck( 0 ).value().reverse();
            } else {
                var ids = _.intersection( _.keys( genre ), _.keys( word ));
                App.debug( "search/getIds/both", ids );
                return _.sortBy( ids, countScore ).reverse();
            }

            function countScore( id ) {
                return word[id] + ( 0.1 * genre[id] );
            };
        };
    };

    function updateResults( err, results ) {

        if ( !err && ( !results || !results.length )) {
            stationList.getView().html( NO_RESULTS );
            stationList.endUpdate();
        } else {
            stationList.update( err, results.slice( 0, 20 ));
        }
    };

    /// Utilities: -------------------------------------------------------------

    function okCb( fn, default_value ) {
        return function() {

            var args =  _.toArray( arguments );
            var cb =    args.pop();
            args.push( onFn );
            
            fn.apply( null, args );
            
            function onFn( err, result ) {
                cb( null, result || default_value );
            };
        };
    };


})( window._, window.$, window.App );
