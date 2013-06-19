;(function( _, X, App ){

    /// Variables: -------------------------------------------------------------

    var genres =        App.Db.genres;
    var words =         App.Db.words;
    var stations =      App.Db.stations;

    /// Exports: ---------------------------------------------------------------

    App.SearchEngine = {
        search:         search,
        tokenize:       tokenize,
        filterWords:    filterWords,
        getKeywords:    getKeywords,
    };

    /// Functions: -------------------------------------------------------------

    function search( query, genre_name, cb ) {

        X.run(
            X.options({
                id:         "search",
                log:        App.DEBUG,
                timeout:    8096
            }), {
                genre:      X.call( okCb( genres.read, {}), genre_name ),
                keywords:   X.call( getKeywords, query, genre_name ),
                ids:        X.callSync( getIds, X.get( "genre" ), X.get( "keywords" )),
                stations:   X.call( stations.listByIds, X.get( "ids" )),
            }, function( e, r ){
            
                e && console.error( JSON.stringify(e), e.error.toString(), JSON.stringify(Object.keys(r)) );   
                cb( e, r.stations );
            });
    }


    function getIds( genre, keywords ) {
       
        var no_genre =  _.isEmpty( genre );
        var kwids =     kwIds( keywords );
        var no_words =  _.isEmpty( kwids );
        App.debug( "search/getIds", no_genre, genre, no_words, kwids );

        if ( no_genre && no_words ) {
            return [];
        } else if ( no_words ) {
            return _( genre ).pairs().sortBy( 1 ).pluck( 0 ).value().reverse();
        } else if ( no_genre ) {
            return _( kwids ).sortBy( countScore ).value().reverse();
        } else {
            var ids = _.intersection( _.keys( genre ), kwids );
            App.debug( "search-engine/getIds/both", ids );
            return _.sortBy( ids, countScore ).reverse();
        }

        function countScore( id ) {
            var score = (
                    (keywords.words[id] || 0)
                    + 0.4 * ( keywords.mwords[id] || 0 )
                    + 0.2 * ( keywords.genres[id] || 0 )
                    + 0.1 * ( keywords.mgenres[id] || 0 ));
            App.debug( "countScore", id, score, keywords.words[id], keywords.genres[id], keywords.mwords[id], keywords.mgenres[id] );
            return score;
        };
        function kwIds( keywords ) {

            return _( keywords ).values().map( Object.keys ).flatten().union().value();
        };
    };


    function getKeywords( query, genre_name, cb ) {

        var qwords =    tokenize( query || genre_name );
        App.debug( "getKeywords", query, genre_name, qwords );

        X.run(
            X.options({
                id:         "getKeywords",
                log:        App.DEBUG,
                timeout:    8096
            }), {
                wscores:    X.call( words.listByIds, qwords ),
                gscores:    X.call( genres.listByIds, qwords ),
                awords:     X.call( words.listIds ),
                mwords:     X.callSync( filterWords, qwords, X.get( "awords" )),
                mwscores:   X.call( words.listByIds, X.get( "mwords" )),
                agenres:    X.call( genres.listIds ),
                mgenres:    X.callSync( filterWords, qwords, X.get( "agenres" )),
                mgscores:   X.call( genres.listByIds, X.get( "mgenres" )),

                keywords:   X.callSync( combineResults,
                                X.get( "wscores" ),
                                X.get( "gscores" ),
                                X.get( "mwscores" ),
                                X.get( "mgscores" )),
            }, function( e, r ) {
            
                App.debug( "getKeywords/job-done", e, Object.keys( r ));
                e && console.error( JSON.stringify(e), e.error.toString(), JSON.stringify(Object.keys(r)) );
                cb( e, r.keywords );
            });

        function combineResults( words, genres, mwords, mgenres ) {
            var result = {
                words:      toObject( words ), //_.extend.apply( _, words.reverse() ),
                genres:     toObject( genres ), //_.extend.apply( _, genres.reverse() ),
                mwords:     toObject( mwords ), //_.extend.apply( _, mwords.reverse() ),
                mgenres:    toObject( mgenres ),
            };
            App.debug( "getKeywords/combineResults", JSON.stringify( result ));
            return result;

            function toObject( arr ) {
                if ( _.isArray( arr )) {
                    arr = _.filter( arr ).reverse();
                    if ( arr.length ) {
                        return _.extend.apply( _, arr );
                    }
                }
                return {};
            };
        };
    };

    /// Utilities: -------------------------------------------------------------

    function tokenize( str ) {

        var result = _.filter( str.toLowerCase().split( /[^a-z0-9]+/g ));
        App.debug( "tokenize", str, result );
        return result;
    };

    /**
     *  Returns a list of words that begin with one of qwords.
     */
    function filterWords( qwords, words ) {
        
        var result = _.union.apply( _, qwords.map( getMatching ));
        App.debug( "filterWords", qwords, words.length, result );
        return result;

        function getMatching( qw ) {
            return _.reject( words, function( w ){
                return w.indexOf( qw );
            });
        };
    };
           
    function okCb( fn, default_value ) {
        return function() {

            var args =  _.toArray( arguments );
            var cb =    args.pop();
            args.push( onFn );
            
            fn.apply( null, args );
            
            function onFn( err, result ) {
                cb( null, result || default_value );
            };
        };
    };


})( window._, window.goodJob, window.App );
