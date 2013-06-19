;(function( _, $, App ){

    /// Constants: -------------------------------------------------------------

    var NO_RESULTS = '<li class="warning">No stations found matching your criteria. Please change your search parameters and try again.</li>';

    /// Variables: -------------------------------------------------------------

    var $form;
    var $results;
    var onChangeTh =    _.throttle( onChange, 1000, { leading: false, trailing: true });
    var SearchEngine =  App.SearchEngine;
    var stationList =   App.StationList();

    /// Exports: ---------------------------------------------------------------

    App.Search = {
        search:         search,
    };

    /// Init: ------------------------------------------------------------------

    $( init );

    /// Functions: -------------------------------------------------------------

    function init() {

        $form =     $( "#search-form" );
        $results =  $( "#search-results" ).append( stationList.getView() );

        $form.on( "change", "select", onChangeTh );
        $form.on( "keydown", "input", onChangeTh );
        $form.on( "change", "input", onChangeTh );
    };

    function onChange() {

        var genre = $form.find( "#search-genre" ).val();
        var query = $form.find( "#search-query" ).val();

        search( query, genre );
    };

    function search( query, genre_name ) {
        App.debug( "search", query, genre_name );

        stationList.anounceUpdate();

        if ( !query && !genre_name ) {
            updateResults( null, [] );
            return;
        } else {
            App.SearchEngine.search( query, genre_name, updateResults );
        }
    };


    function updateResults( err, results ) {

        if ( !err && ( !results || !results.length )) {
            stationList.getView().html( NO_RESULTS );
            stationList.endUpdate();
        } else {
            stationList.update( err, results.slice( 0, 20 ));
        }
    };

})( window._, window.$, window.App );
