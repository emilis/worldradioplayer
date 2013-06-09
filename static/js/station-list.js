;(function( _, $, App ){

    /// Exports: ---------------------------------------------------------------

    App.StationList = createStationList;

    /// Functions: -------------------------------------------------------------

    function createStationList() {

        var $view;
        var update_count = 0;

        return {
            getView:        getView,
            anounceUpdate:  anounceUpdate,
            endUpdate:      endUpdate,
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
            update_count++;
        };

        function endUpdate() {
            update_count--;
            !update_count && getView().removeClass( "loading" );
        };


        function update( err, stations ) {

            var $list = getView();

            if ( err ) {
                $list.html( '<li class="error">Error loading station list.</li>' );
            } else if ( !stations || !stations.length ) {
                $list.html( '<li class="warning">No stations in list.</li>' );
            } else {
                $list.html( "" );
                _( stations ).map( App.Station.fromInfo ).forEach( addStation );
            }

            endUpdate();

            function addStation( info ){
                $list.append( App.Station.getView( info ));
            };
        };
    };

})( window._, window.$, window.App );
