;(function( _, $, App ){

    /// Variables: -------------------------------------------------------------

    var $view;
    var stations =      App.Db.stations;
    var stationList =   App.StationList();

    /// Exports: ---------------------------------------------------------------

    App.LastPlayed = {
        update:     update,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        $view = $( "#last > .tabpanel" );
        $view.html( "" ).append( stationList.getView() );

        update( switchToSearch );

        function switchToSearch( err, results ) {
            $view.removeClass( "app-loading" );
            ( err || !results || !results.length ) && App.Explorer.show( "search" );
        }
    };

    function update( cb ) {

        stationList.anounceUpdate();

        stations.list(
            lastFilter,
            { limit: 10 },
            onUpdate );

        function onUpdate( err, results ) {
            stationList.update( err, results );
            cb && cb( err, results );
        };
    };

    function lastFilter( station ) {

        return station.last_played && App.SoundPlayer.isStationSupported( station );
    };

})( window._, window.$, window.App );
