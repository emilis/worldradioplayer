;(function( _, $, App ){

    /// Constants: -------------------------------------------------------------

    var LABEL_PLAY =    '<i class="icon-play"></i>';
    var LABEL_PAUSE =   '<i class="icon-pause"></i>';
    var LABEL_STOP =    '<i class="icon-stop"></i>';

    /// Vars: ------------------------------------------------------------------

    var $player;
    var $explorer;
    var $stations;

    /// Exports: ---------------------------------------------------------------

    App.Views = {
        playStation:    playStation,
        showStations:   showStations,
        getStationView: getStationView,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        $player =   $( "#player" );
        $explorer = $( "#explorer" );
        $stations = $( $( "#station-list" ).html() );

        $player.on( "click", ".play", App.Player.play );
        $player.on( "click", ".stop", App.Player.stop );
    };


    function playStation( station ) {

        $player.find( ".state" ).html( "Playing:" );
        $player.find( ".play" ).removeClass( "disabled" ).html( LABEL_PAUSE );
        if ( station ) {
            $player.find( ".song-name" ).html( station.name );
            station.$view.find( ".play" ).html( LABEL_PAUSE );
        }
    };

    function stopPlayer() {
    
        $player.find( ".state" ).html( "Stopped." );
        $player.find( ".play" ).addClass( "disabled" ).html( LABEL_PLAY );
        $player.find( ".song-name" ).html( "" );
    };

    function pausePlayer() {
        
        $player.find( ".state" ).html( "Paused." );
    };


    function showStations( stations ) {

        $stations.html( "" );
        _.forEach( stations, addStation );
        $explorer.html( "" );
        $explorer.append( $stations );

        function addStation( station ){
            $stations.append( getStationView( station ));
        };
    };


    function getStationView( station ) {

        if ( !station.$view ) {
            var $view = station.$view = $( $( "#station-view" ).html() );
            $view.find( ".name" ).html( station.name );
            $view.find( ".description" ).html( station.description );
            $view.on( "click", ".play", toggle );
            station.$view = $view;
        }

        return station.$view;

        function toggle() {
            if ( station.playing ) {
                station.$view.find( ".play" ).html( LABEL_PLAY );
                pausePlayer();
                App.Player.pause();
            } else {
                station.$view.find( ".play" ).html( LABEL_PAUSE );
                playStation( station );
                App.Player.playStation( station );
            }
        }
    };

})( window._, window.$, window.App );
