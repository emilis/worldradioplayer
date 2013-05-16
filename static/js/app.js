;(function( window, _ ){

    /// Constants: -------------------------------------------------------------

    var DEBUG = true;

    var LABEL_PLAY =    '<i class="icon-play"></i>';
    var LABEL_PAUSE =   '<i class="icon-pause"></i>';
    var LABEL_STOP =    '<i class="icon-stop"></i>';


    /// Exports: ---------------------------------------------------------------
    
    /**
     *  Export main app namespace:
     */
    var App = window.App = {
        debug:          debug,
        LABEL_PLAY:     LABEL_PLAY,
        LABEL_PAUSE:    LABEL_PAUSE,
        LABEL_STOP:     LABEL_STOP,
        AppController: {
            playStation:    playStation,
            pauseStation:   pauseStation,
            stop:           stop,
        },
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        /// Currently we do nothing.
        /// The widtgets init themselves.
    };

    function playStation( station ) {

        var pstation = App.SoundPlayer.getCurrentStation();
        App.SoundPlayer.playStation( station );
        App.Player.showStation( station );
        pstation && App.StationList.updateStation( pstation );
        App.StationList.updateStation( station );
    };

    function pauseStation( station ) {

        var cstation = App.SoundPlayer.getCurrentStation();
        if ( !_.isEqual( station, cstation )) {
            throw Error( "Trying to pause a station that is not currently playing." );
        }
        App.SoundPlayer.pause();
        App.Player.update();
        App.StationList.updateStation( station );
    };

    function stop() {

        var station = App.SoundPlayer.getCurrentStation();
        App.SoundPlayer.stop();
        App.Player.update();
        App.StationList.updateStation( station );
    };

    /// Utilities: -------------------------------------------------------------

    function debug() {

        if ( DEBUG ) {
            var args = Array.prototype.slice.call( arguments );
            args.unshift( "WorldRadioPlayer" );
            console.log.apply( console, arguments );
        }
    };

})( window, window._ );
