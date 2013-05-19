;(function( _, $, App ){

    /// Variables: -------------------------------------------------------------

    var station_tpl;

    /// Exports: ---------------------------------------------------------------

    App.Station = {
        getView:    getView,
        updateView: updateView,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        station_tpl =   document.getElementById( "station-view" ).innerHTML;
    };


    function getView( station ) {

        if ( !station.$view ) {
            var $view = station.$view = $( station_tpl );
            /*
            if ( !App.SoundPlayer.isStationSupported( station )) {
                $view.addClass( "unsupported" );
            }
            */
            $view.find( ".name" ).html( station.name );
            $view.find( ".description" ).html( station.description );
            $view.on( "click", ".play", toggle );
            station.$view = $view;
        }

        return station.$view;

        function toggle() {
            if ( station.playing ) {
                App.AppController.pauseStation( station );
            } else {
                App.AppController.playStation( station );
            }
        }
    };

    function updateView( station ) {

        if ( station.playing ) {
            station.$view.addClass( "playing" ).find( ".play" ).html( App.LABEL_PAUSE );
        } else {
            station.$view.removeClass( "playing" ).find( ".play" ).html( App.LABEL_PLAY );
        }
    };


})( window._, window.$, window.App );
