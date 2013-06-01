;(function( _, $, App ){

    /// Variables: -------------------------------------------------------------

    var $player;
    var $state;
    var $song_name;
    var $play;
    var $stop;

    /// Exports: ---------------------------------------------------------------

    App.Player = {
        update:         update,
        showStation:    showStation,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        $player =       $( "#player" );
        $state =        $player.find( ".state" );
        $song_name =    $player.find( ".song-name" );
        $play =         $player.find( ".play" );
        $stop =         $player.find( ".stop" );

        $play.on( "click", togglePlay );
        $stop.on( "click", stop );
        
        update();
    };

    function update() {

        showStation( App.SoundPlayer.getCurrentStation() );
    };

    function togglePlay() {

        if ( !$play.hasClass( "disabled" )) {
            var station = App.SoundPlayer.getCurrentStation();
            if ( station ) {
                if ( station.playing ) {
                    App.AppController.pauseStation( station );
                } else {
                    App.AppController.playStation( station );
                }
            } else {
                showStation();
            }
        }
    };

    function stop() {

        if ( !$stop.hasClass( "disabled" )) {
            App.AppController.stop();
        }
    };

    function showStation( station ) {

        if ( !station ) {
            $state.html( "Stopped." );
            $song_name.html( "" );
            $play.addClass( "disabled" ).html( App.LABEL_PLAY );
            $stop.addClass( "disabled" );
        } else {
            $song_name.html( station.info.name );
            $play.removeClass( "disabled" );
            $stop.removeClass( "disabled" );
            if ( station.playing ) {
                $state.html( "Playing:" );
                $play.html( App.LABEL_PAUSE );
            } else {
                $state.html( "Paused:" );
                $play.html( App.LABEL_PLAY );
            }
        }
    };

})( window._, window.$, window.App );
