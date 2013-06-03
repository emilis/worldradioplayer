;(function( _, buzz, App ){

    /// Constants: -------------------------------------------------------------

    var SOUND_OPT = {
        autoplay:   false,
        loop:       false,
    };

    /// Variables: -------------------------------------------------------------

    var currentStation;

    /// Exports: ---------------------------------------------------------------

    App.SoundPlayer = {
        getCurrentStation:  getCurrentStation,
        playStation:        playStation,
        play:               play,
        stop:               stop,
        pause:              pause,
        getSound:           getSound,
        isStreamSupported:  isStreamSupported,
        isStationSupported: isStationSupported,
    };

    /// Functions: -------------------------------------------------------------

    function getCurrentStation() {

        return currentStation;
    };

    function playStation( station ) {
        App.debug( "Player", "playStation", JSON.stringify( station ));

        currentStation && currentStation.playing && stop();

        currentStation = station || currentStation;
        currentStation.sound = currentStation.sound || getSound( currentStation );
        if ( currentStation.sound ) {
            currentStation.sound.load().play();
            currentStation.playing = true;
        }
    };

    function play() {
        App.debug( "Player", "play" );

        playStation();
    };

    function stop() {
        App.debug( "Player", "stop" );

        currentStation.sound.stop();
        currentStation.playing = false;
        currentStation = null;
    };

    function pause() {
        App.debug( "Player", "pause" );

        currentStation.sound.stop();
        currentStation.playing = false;
    };

    function getSound( station ) {
        App.debug( "Player", "getSound", station );

        var streams = _.filter( station.info.streams, isStreamSupported );
        if ( streams && streams.length ) {
            var sound = new buzz.sound( streams[0].url, SOUND_OPT );
            //sound.bind( "durationchange", reloadSound );
            sound.bind( "ended", reloadSound );
            //debugSound( sound );
            return sound;
        }

        function reloadSound() {
            App.debug( "Player", "Reloading sound", sound );
            sound.stop().load().play();
            //setTimeout( function(){ sound.load().play(); }, 50 );
        }
    };

    function debugSound( sound ) {

        var events = "abort canplay canplaythrough dataunavailable durationchange emptied empty ended error loadeddata loadedmetadata loadstart pause play playing ratechange seeked seeking suspend volumechange waiting";
        events = events.split( " " );

        for ( var i=0,len=events.length; i<len; i++ ) {
            sound.bind( events[i], logEvent( events[i] ));
        }

        function logEvent( name ) {
            return function( e ) {
                console.log( "soundEvent", name, sound.getErrorCode(), sound.getStateCode(), sound.getNetworkStateCode() );
            };
        };
    };

    function isStreamSupported( stream ) {

        /*
        var supported = {
            "wav":              true,
            "ogg":              true,
            "application/ogg":  true,
            "audio/aacp":       false,
            "audio/aac":        false,
            "audio/mpeg":       false,
            "data":             false,
            "video":            false,
        }

        return !! supported[ stream.type ];
        /* */
        switch ( stream.type ) {
            case "ogg":
            case "application/ogg":
                return buzz.isOGGSupported();
                break;
            case "wav":
                return buzz.isWAVSupported();
                break;
            case "mp3":
            case "audio/mpeg":
                return buzz.isMP3Supported();
                break;
            case "aac":
            case "audio/aac":
            case "audio/aacp":
                return buzz.isAACSupported();
                break;
            default:
                return false;
        }
        // */
    };

    function isStationSupported( station ) {

        var streams = station.streams || station.info.streams;
        return _.some( streams, isStreamSupported );
    };

})( window._, window.buzz, window.App );
