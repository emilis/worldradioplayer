;(function( _, App ){

    /// Constants: -------------------------------------------------------------

    var SOUND_OPT = {
        autoplay:   false,
        loop:       false,
    };

    /// Variables: -------------------------------------------------------------

    var currentStation;

    /// Exports: ---------------------------------------------------------------

    App.Player = {
        playStation:        playStation,
        play:               play,
        stop:               stop,
        pause:              pause,
        getSound:           getSound,
        isStreamSupported:  isStreamSupported,
        isStationSupported: isStationSupported,
    };

    /// Functions: -------------------------------------------------------------

    function playStation( station ) {
        console.log( "Player", "playStation", JSON.stringify( station ));

        currentStation && currentStation.playing && stop();

        currentStation = station || currentStation;
        currentStation.sound = currentStation.sound || getSound( currentStation );
        if ( currentStation.sound ) {
            currentStation.sound.load().play();
            currentStation.playing = true;
        }
    };

    function play() {
        console.log( "Player", "play" );

        playStation();
    };

    function stop() {
        console.log( "Player", "stop" );

        currentStation.sound.stop();
        currentStation.playing = false;
        currentStation = null;
    };

    function pause() {
        console.log( "Player", "pause" );

        currentStation.sound.fadeOut().pause();
        currentStation.playing = false;
    };

    function getSound( station ) {

        var streams = _.filter( station.streams, isStreamSupported );
        if ( streams && streams.length ) {
            return new buzz.sound( streams[0].url, SOUND_OPT );
        }
    };

    function isStreamSupported( stream ) {

        switch ( stream.type ) {
            case "ogg":
                return buzz.isOGGSupported();
                break;
            case "wav":
                return buzz.isWAVSupported();
                break;
            case "mp3":
                return buzz.isMP3Supported();
                break;
            case "aac":
                return buzz.isAACSupported();
                break;
            default:
                return false;
        }
    };

    function isStationSupported( station ) {

        return _.some( station.streams, isStreamSupported );
    };

})( window._, window.App );
