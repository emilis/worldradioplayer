;(function( _, App ){

    /// Variables: -------------------------------------------------------------

    var genres = [];
    var $view;

    /// Exports: ---------------------------------------------------------------

    App.Genres = {
        genres:     genres,
        getView:    getView,
    };

    /// Main: ------------------------------------------------------------------

    main();

    /// Functions: -------------------------------------------------------------

    function main() {

        $view = getView();

        App.Db.stations.list( null, null, _.compose( refillView, addGenres ));
    };

    function addGenres( err, stations ) {

        if ( err ) {
            return [];
        }

        var re = /\W+/g;

        genres = _( stations.reduce( getMap, {} ))
                .pairs()
                .sortBy( 1 )
                .reverse()
                .value();
        App.Genres.genres = genres;

        return genres;

        function getMap( gmap, station ) {
            if ( station.genre ) {
                _( station.genre.split( re ))
                    .compact()
                    .map( simplifyString )
                    .uniq()
                    .forEach( addGenre );
            }
            return gmap;
            function addGenre( genre ) {
                gmap[ genre ] = gmap[ genre ] ? ( gmap[ genre ] + 1 ) : 1;
            };
        };
        function simplifyString( str ) {
            return str.toLowerCase();
        };
    };


    function getView() {

        if ( !$view ) {
            var html = [ '<select id="genre-list"></select>' ];
            $view = $( html.join( "" ));
        }
        
        return $view;
    };


    function refillView( genres ) {

        $view.html( '<option>All</option>' );
        _.forEach( genres.slice( 0, 100 ), appendGenre );
        return $view;

        function appendGenre( genre ) {
            $view.append( getGenreView( genre ));
        };
    };

    function getGenreView( genre ) {
        var html = [ '<option><b>' ];
        html.push( genre[0] );
        genre[1] ? html.push( ':</b> ', genre[1] ) : html.push( '</b>' );
        html.push( '</option>' );
        return html.join( "" );
    };


})( window._, window.App );
