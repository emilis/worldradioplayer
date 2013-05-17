;(function( _, $, App ){

    /// Variables: -------------------------------------------------------------

    var $list;

    /// Exports: ---------------------------------------------------------------

    App.StationList = {
        getView:        getView,
        showStations:   showStations,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        $list =         $( document.getElementById( "station-list" ).innerHTML );

        showStations( App.Stations );
    };

    function getView() {

        return $list;
    };

    function showStations( stations ) {

        $list.html( "" );
        _.forEach(
            _.filter( stations, App.SoundPlayer.isStationSupported ).slice( 0, 20 ),
            addStation );

        function addStation( station ){
            $list.append( App.Station.getView( station ));
        };
    };

})( window._, window.$, window.App );
