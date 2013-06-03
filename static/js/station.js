;(function( _, $, App ){

    /// Variables: -------------------------------------------------------------

    var station_tpl;
    var stations =      {};

    /// Exports: ---------------------------------------------------------------

    App.Station = {
        fromInfo:       fromInfo,
        getView:        getView,
        updateInfo:     updateInfo,
        updateViews:    updateViews,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        station_tpl =   document.getElementById( "station-view" ).innerHTML;
    };


    function fromInfo( info ) {

        if ( !stations[ info.name ] ) {
            stations[ info.name ] = {
                info:       info,
                $views:     $( "empty-collection" ),
            };
        }
        return stations[ info.name ];
    };


    function getView( station ) {

        /// Get a collection of view elements disconnected from DOM:
        var unused_views =  station.$views.not( hasParent );

        if ( unused_views.length ) {
            return unused_views[0];
        } else {
            var $view = createView( station );
            station.$views.push( $view[0] );
            updateViews( station );
            return $view;
        }

        function hasParent( i ) {
            return station.$views[i].parentNode;
        }
    };

    function createView( station ) {

        var $view = $( station_tpl );
        $view.find( ".name" ).html( station.info.name );
        $view.find( ".description" ).html( station.info.description );
        $view.find( ".genre" ).html( station.info.genre );
        $view.on( "click", ".play", toggle );

        return $view;

        function toggle() {
            if ( station.playing ) {
                App.AppController.pauseStation( station );
            } else {
                App.AppController.playStation( station );
            }
        }
    };

    function updateViews( station ) {

        if ( station.playing ) {
            station.$views.addClass( "playing" ).find( ".play" ).html( App.LABEL_PAUSE );
        } else {
            station.$views.removeClass( "playing" ).find( ".play" ).html( App.LABEL_PLAY );
        }
    };

    function updateInfo( station, info, cb ) {

        station.info = _.merge( station.info, info );
        App.Db.stations.write( station.info.name, station.info, cb );
        return station;
    };


})( window._, window.$, window.App );
