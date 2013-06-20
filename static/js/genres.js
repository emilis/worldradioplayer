;(function( _, App ){

    /// Constants: -------------------------------------------------------------

    var TOP_COUNT = 50;

    /// Variables: -------------------------------------------------------------

    var $view;

    /// Exports: ---------------------------------------------------------------

    App.Genres = {
        getView:    getView,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        App.Db.genres.toObject( refillView );
    };

    function getView() {

        if ( !$view ) {
            $view = $( "#search-genre" );
        }
        
        return $view;
    };

    function refillView( err, genres ) {

        var sorted = _( genres ).map( getCount ).sortBy( 1 ).value().reverse().slice( 0 , TOP_COUNT );

        var html = _.flatten([
            '<option value="">All genres</option>',
            sorted.map( getGenreHtml )
            ]);

        return getView().html( html.join( "" )).removeAttr( "disabled" );

        function getCount( scores, name ) {
            if ( !scores ) {
                return [ name, 0 ];
            } else {
                return [ name, Object.keys( scores ).length ];
            }
        };

    };

    function getGenreHtml( genre ) {

        var html = [ '<option value="', genre[0], '"><b>' ];
        html.push( genre[0] );
        genre[1] ? html.push( '</b> (', genre[1], ' stations)' ) : html.push( '</b>' );
        html.push( '</option>' );
        return html;
    };

    function getGenreView( genre ) {
        return getGenreHtml( genre ).join( "" );
    };


})( window._, window.App );
