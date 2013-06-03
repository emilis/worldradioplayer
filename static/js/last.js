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

        update();
    };

    function update() {

        stationList.anounceUpdate();

        stations.list(
            lastFilter,
            { limit: 10 },
            stationList.update );
    };

    function lastFilter( station ) {

        return App.SoundPlayer.isStationSupported( station );
    };

})( window._, window.$, window.App );
