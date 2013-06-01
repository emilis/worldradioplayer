;(function( _, $, App ){

    /// Variables: -------------------------------------------------------------

    var $explorer;

    /// Exports: ---------------------------------------------------------------

    App.Explorer = {
        show:       show,
        update:     update,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        $explorer = $( "#explorer" );
        update( "last", App.StationList.getView() );
        update( "search", App.Genres.getView() );
        show( "last" );
    };


    function update( name, $view ) {

        getTab( name ).html( "" ).append( $view );
    };

    function show( name ) {

        getTab( name ).show();
    };

    function getTab( name ) {

        return $explorer.find( '#'+name+' > .tabpanel' );
    };

})( window._, window.$, window.App );
