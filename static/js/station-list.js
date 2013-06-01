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

        $list = $( document.getElementById( "station-list" ).innerHTML );

        App.Db.stations.list(
            App.SoundPlayer.isStationSupported,
            { limit: 20 },
            showStations );
    };

    function getView() {

        return $list;
    };

    function showStations( err, stations ) {

        if ( err ) {
            $list.html( '<p class="error">Error loading station list.</p>' );
            return;
        } else if ( !stations || !stations.length ) {
            $list.html( '<p class="error">Error: station DB is empty.</p>' );
            return;
        } else {
            $list.html( "" );
            _( stations ).map( App.Station.fromInfo ).forEach( addStation );
        }

        function addStation( info ){
            $list.append( App.Station.getView( info ));
        };
    };

})( window._, window.$, window.App );
