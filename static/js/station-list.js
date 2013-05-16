;(function( _, $, App ){

    /// Variables: -------------------------------------------------------------

    var $list;
    var station_tpl;

    /// Exports: ---------------------------------------------------------------

    App.StationList = {
        getView:        getView,
        getStationView: getStationView,
        showStations:   showStations,
        updateStation:  updateStation,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        $list =         $( document.getElementById( "station-list" ).innerHTML );
        station_tpl =   document.getElementById( "station-view" ).innerHTML;

        showStations( App.Stations );
    };

    function getView() {

        return $list;
    };

    function showStations( stations ) {

        $list.html( "" );
        _.forEach( stations, addStation );

        function addStation( station ){
            $list.append( getStationView( station ));
        };
    };

    function getStationView( station ) {

        if ( !station.$view ) {
            var $view = station.$view = $( station_tpl );
            if ( !App.SoundPlayer.isStationSupported( station )) {
                $view.addClass( "unsupported" );
            }
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

    function updateStation( station ) {

        if ( station.playing ) {
            station.$view.addClass( "playing" ).find( ".play" ).html( App.LABEL_PAUSE );
        } else {
            station.$view.removeClass( "playing" ).find( ".play" ).html( App.LABEL_PLAY );
        }
    };

})( window._, window.$, window.App );
