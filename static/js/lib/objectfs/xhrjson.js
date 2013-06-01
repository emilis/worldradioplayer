;(function( window, _ ){

    /// Exports: ---------------------------------------------------------------

    window.ObjectFsXhrJson = {
        read:       read,
        write:      write,
        list:       list,
    };

    /// Functions: -------------------------------------------------------------

    function read( url, cb ) {

        var req =           new XMLHttpRequest();
        req.open( "GET", url, true );
        req.setRequestHeader( "Accept", "application/json" );
        req.responseType =  "json";
        req.onload =        onLoad;
        req.send();

        function onLoad() {

            if ( this.status > 299 ) {
                cb( this.status, this.statusText );
            } else {
                cb( null, this.response );
            }
        };
    };

    function write( url, record, cb ) {

        var req =           new XMLHttpRequest();
        req.open( "POST", url, true );
        req.setRequestHeader( "Accept", "application/json" );
        req.responseType =  "json";
        req.onload =        onLoad;
        req.send( JSON.stringify( record ));

        function onLoad() {
            
            if ( this.status > 299 ) {
                cb( this.status, this.statusText );
            } else {
                cb( null, this.response );
            }
        };
    };

    function list( url, filter, options, cb ) {

        var req =           new XMLHttpRequest();
        req.open( "GET", url, true );
        req.setRequestHeader( "Accept", "application/json" );
        req.responseType =  "json";
        req.onload =        onLoad;
        req.send();

        function onLoad() {

            if ( this.status > 299 ) {
                cb( this.status, this.statusText );
            } else {
                cb( null, this.response );
            }
        };
    };

})( window, window._ );
