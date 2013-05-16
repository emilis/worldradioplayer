;(function( _, $, App ){

    /// Variables: -------------------------------------------------------------

    var $explorer;

    /// Exports: ---------------------------------------------------------------

    App.Explorer = {
        show:   show,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        $explorer = $( "#explorer" );
        show( App.StationList.getView() );
    };


    function show( $view ) {

        $explorer.html( "" ).append( $view );
    };

})( window._, window.$, window.App );
