;(function( _, async, $, App ){

    /// Variables: -------------------------------------------------------------

    var $view;
    var last =          App.Db.last;
    var stationList =   App.StationList();

    /// Exports: ---------------------------------------------------------------

    App.LastPlayed = {
        updateView:     updateView,
        listStations:   listStations,
        updateStation:  updateStation,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        $view = $( "#last > .tabpanel" );
        $view.html( "" ).append( stationList.getView() );

        updateView( onLoad );

        function onLoad( err, results ) {
            App.debug( "switchToSearch", err, results && results.length );

            $view.removeClass( "app-loading" );
            if ( err || !results || !results.length ) {
                App.Explorer.show( "search" );
            } else {
                App.AppController.playStation( App.Station.fromInfo( results[0] ));
            }
        }
    };

    function updateView( cb ) {

        stationList.anounceUpdate();
        listStations( null, { limit: 10 }, onStations );

        function onStations( err, stations ) {
            console.log( "onStations", err, stations );

            stationList.update( err, stations );
            cb && cb( err, stations );
        };
    };

    function listStations( filter, options, cb ) {

        last.list( null, options, onList );

        function onList( err, results ) {
            if ( err || !results || !results.length ) {
                cb && cb( err, results );
            } else {
                results = _.sortBy( results, "last_time" ).reverse();
                async.mapSeries( results, readStation, cb );
            }
            function readStation( lastRecord, recordCb ) {
                App.Db.stations.read( lastRecord._id, recordCb );
            };
        };
    };

    function updateStation( station, cb ) {

        var info =  station.info || station;
        var _id =   info.name;
        last.read( _id, onRead );

        function onRead( err, record ) {
            record =            record || {};
            record._id =        _id;
            var new_station =   !record.last_time;
            record.last_time =  (new Date()).getTime();
            record.times =      record.times || 0;
            record.times +=     1;
            last.write( _id, record, onWrite );

            function onWrite( err, result ) {
                cb && cb( err, result );
                new_station && updateView();
            };
        };
    };

    function lastFilter( station ) {

        return station.last_played && App.SoundPlayer.isStationSupported( station );
    };

})( window._, window.async, window.$, window.App );
