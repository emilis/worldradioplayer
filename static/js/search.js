;(function( _, $, App ){

    /// Variables: -------------------------------------------------------------

    var $form;
    var $results;
    var stationList =   App.StationList();
    var stations =      App.Db.stations;
    var onChangeTh =    _.throttle( onChange, 200 );

    /// Exports: ---------------------------------------------------------------

    App.Search = {
        search: search,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        $form =     $( "#search-form" );
        $results =  $( "#search-results" );

        $form.on( "change", "select", onChangeTh );
        $form.on( "keydown", "input", onChangeTh );
        $form.on( "change", "input", onChangeTh );
    };

    function onChange() {

        var genre = $form.find( "#search-genre" ).val();
        var query = $form.find( "#search-query" ).val();

        search( query, genre );
    };

    function search( query, genre ) {

        stationList.anounceUpdate();

        stations.list(
            getFilter( query, genre ),
            { limit: 20 },
            updateResults );
    };

    function getFilter( query, genre ) {

        var qre = new RegExp( query, "i" );
        var gre = new RegExp( genre, "i" );
        
        return checkStation;
            
        function checkStation( station ) {
            var matched =   false;
            matched =       !genre || ( genre && station.genre.match( gre ));
            matched =       matched && ( station.name.match( qre ));
            matched =       matched && App.SoundPlayer.isStationSupported( station );
            return matched;
        };
    };

    function updateResults( err, results ) {

        if ( err ) {
            $results.html( "Error while searching stations." );
        } else if ( !results || !results.length ) {
            $results.html( "No stations found matching your criteria. Please change your search parameters and try again." );
        } else {
            $results.html( "" ).append( stationList.getView() );
            stationList.update( null, results );
        }
    };

})( window._, window.$, window.App );
