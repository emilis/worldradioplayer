;(function( _, App ){

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        var stations = _.filter( App.Stations, App.Player.isStationSupported );
        console.log( "filtered stations", JSON.stringify( stations ));
        App.Views.showStations( stations );
    };

})( window._, window.App );
