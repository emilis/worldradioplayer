;(function( _, $, App ){

    /// Exports: ---------------------------------------------------------------

    App.StationList = createStationList;

    /// Functions: -------------------------------------------------------------

    function createStationList() {

        var $view;

        return {
            getView:        getView,
            anounceUpdate:  anounceUpdate,
            update:         update,
        };
        
        function getView() {
            if ( !$view ) {
                $view = $( document.getElementById( "station-list" ).innerHTML );
            }
            return $view;
        };


        function anounceUpdate() {
            
            getView().addClass( "loading" );
        };


        function update( err, stations ) {

            var $list = getView();

            if ( err ) {
                $list.html( '<p class="error">Error loading station list.</p>' );
            } else if ( !stations || !stations.length ) {
                $list.html( '<p class="error">Error: station DB is empty.</p>' );
            } else {
                $list.html( "" );
                _( stations ).map( App.Station.fromInfo ).forEach( addStation );
            }
            $list.removeClass( "loading" );

            function addStation( info ){
                $list.append( App.Station.getView( info ));
            };
        };
    };

})( window._, window.$, window.App );
