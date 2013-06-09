;(function( window, _ ){

    /// Exports: ---------------------------------------------------------------

    window.ObjectFsWithCached = connect;

    /// Functions: -------------------------------------------------------------
    
    function connect( asyncWrapper, withObject ) {

        var loading;
        var error;
        var done;
        var waiting = [];

        return asyncWrapper( withCachedObject );

        function withCachedObject( fn ) {

            if ( done ) {
                fn( error, done );
            } else {
                waiting.push( fn );
                if ( !loading ) {
                    loading = true;
                    withObject( resolveWaiting );
                }
            }
        };

        function resolveWaiting( err, result ) {

            error =     err;
            done =      result;
            loading =   false;

            waiting.map(function( fn ){
                fn( error, done );
            });
        };
    };


})( window, window._ );
