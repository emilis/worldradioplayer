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
        show( "last" );
    };


    function update( name, $view ) {

        getTab( name ).html( "" ).append( $view );
    };

    function show( name ) {

        window.location.hash = "#"+name;
    };

    function getTab( name ) {

        return $explorer.find( '#'+name+' > .tabpanel' );
    };

})( window._, window.$, window.App );
