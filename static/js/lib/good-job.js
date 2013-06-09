/*
    Copyright 2012 UAB "PriceOn" <http://www.priceon.lt/>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

;(function(){

    var root = this;

    /// Exports: --------------------------------------------------------------

    root.goodJob = {

        job:            function(){ return Job.prototype.extend.apply(new Job(), arguments); },
        extend:         function(){ return Job.prototype.extend.apply(new Job(), arguments); },
        tasks:          function(){ return Job.prototype.addTasks.apply(new Job(), arguments); },
        set:            function(){ return Job.prototype.set.apply(new Job(), arguments); },
        createFunction: function(){ return Job.prototype.compile.apply(new Job(), arguments); },
        run:            function(){ return Job.prototype.run.apply(new Job(), arguments); },

        wait:           function(){ return Task.prototype.wait.apply(new Task(), arguments); },
        call:           function(){ return Task.prototype.call.apply(new Task(), arguments); },
        callSync:       function(){ return Task.prototype.callSync.apply(new Task(), arguments); },
    /// onError:        function(){ return Task.prototype.err.apply(new Task(), arguments); },
        subTasks:       function(){ return Task.prototype.subTasks.apply(new Task(), arguments); },

        get:            function(){ return Request.prototype.get.apply(new Request(), arguments); },
        getAll:         function(){ return Request.prototype.getAll.apply(new Request(), arguments); },

        options:        function(opt){  return obj_extend(new Options(), opt); },

        TaskError:          TaskError,
        HandledTaskError:   HandledTaskError,
    };


    /// Options: ------------------------------------------------------------------

    function Options() {};


    /// Job: ----------------------------------------------------------------------

    /**
     *
     */
    function Job() {

        this.cb =       false;
        this.errb =     false;
        this.opts =     {};

        this.results =  {};
        this.tasks =    {};
        this.error =    null;
    };


    /**
     *
     */
    Job.prototype.clone =   function() {

        var njob =      new Job();
        njob.cb =       this.cb;
        njob.errb =     this.errb;
        njob.opts =     this.opts;
        njob.errors =   {};
        obj_extend(njob.results, this.results);
        obj_extend(njob.tasks, this.tasks);

        return njob;
    };


    /**
     *
     */
    Job.prototype.extend =  function() {
        var job =   this;

        arg_map(arguments, function(arg) {
            if (arg instanceof Job) {
                job.log("INFO", "extending job");
                job.cb =        arg.cb ||   job.cb;
                job.errb =      arg.errb || job.errb;
                job.opts =      obj_extend(job.opts, arg.opts);
                job.results =   obj_extend(job.results, arg.results);
                job.tasks =     obj_extend(job.tasks, arg.tasks);
            } else if (arg instanceof Options) {
                job.options(arg);
            } else if (arg instanceof Function) {
                if (job.cb) {
                    job.setErrback(arg);
                } else {
                    job.setCallback(arg);
                }
            } else if (arg instanceof Object) {
                job.addTasks(arg);
            }
        });

        return this;
    };


    /**
     *
     */
    Job.prototype.addTasks =   function(task_list) {

        for (var k in task_list) {
            this.set(k, task_list[k]);
        }

        return this;
    };


    /**
     *
     */
    Job.prototype.set =         function(name, value) {

        if (value instanceof Task) {
            this.log("FUNC", name, "Task");
            this.tasks[name] =      value;
        } else if (value instanceof Request) {
            this.log("FUNC", name, "Request", value);
            this.tasks[name] =      value.toTask();
        } else {
            this.log("VALUE", name, typeof(value));
            delete this.tasks[name];
            this.results[name] =    value;
        }

        return this;
    };


    /**
     *
     */
    Job.prototype.setCallback = function(cb) {

        if (cb && cb instanceof Function) {
            this.log("INFO", "callback", typeof(cb));
            this.cb =   cb;
        }

        return this;
    };


    /**
     *
     */
    Job.prototype.setErrback =  function(errb) {

        if (errb && errb instanceof Function) {
            this.log("INFO", "errback", typeof(errb));
            this.errb = errb;
        }

        return this;
    };


    /**
     *
     */
    Job.prototype.compile = function(fn_args) {
        var job =   this;

        this.extend.apply(this, args_to_array(arguments).slice(1));
        
        return function() {

            var njob =      job.clone();

            njob.setCallback(arguments[fn_args.length]);
        
            var len =   Math.min(fn_args.length, arguments.length);
            for (var i=0; i<len; i++) {
                njob.results[fn_args[i]] =   arguments[i];
                njob.log("VALUE", fn_args[i], typeof(arguments[i]));
            }

            njob.execute();
        };
    };


    /**
     *
     */
    Job.prototype.run =     function() {


        if (arguments.length) {
            var args =  args_to_array(arguments);

            var cb =    args[args.length - 1];
            if (cb && cb instanceof Function) {
                this.cb =   args.pop();
            }

            this.extend.apply(this, args);
        }

        this.execute();
    };


    /**
     *
     */
    Job.prototype.execute = function() {
        var job =   this;

        this.log("EXEC");

        /// TODO: add TaskList validation

        if (this.opts.timeout) {
            setTimeout(function() {
                    if (job.cb || job.errb || job.tasksLeft()) {
                        job.log("TIMEOUT");
                        job.taskDone("", "timeout");
                    }
                }, this.opts.timeout);
        }
        this.nextStep();
    };


    /**
     *
     */
    Job.prototype.tasksLeft =   function() {

        return Object.getOwnPropertyNames(this.tasks).length;
    };


    /**
     *
     */
    Job.prototype.taskDone =    function(name, err, result) {

        if (err && err instanceof TaskError) {
            err.task_name = name;
        }

        this.logDone(name, err, result);

        if (name) {
            this.results[name] =    result;
        }

        this.error =            err
        if (err) {
            this.tasks =    {};
            this.jobDone();
        } else if (this.tasksLeft()) {
            this.nextStep();
        } else {
            this.jobDone();
        }
    };


    /**
     *
     */
    Job.prototype.nextStep =    function() {
        var job =   this;

        for (var tname in this.tasks) {
            runTask(this, tname, this.tasks[tname]);
        }

        function runTask(job, tname, task) {

            var wait =  task.dependencies && task.dependencies.length && task.dependencies.some(is_not_done);
            if (!wait) {
                if (task instanceof Function) {
                    var action = task;
                } else {
                    var action = task.action.bind(task);
                }
                job.log("EXEC", tname);
                delete job.tasks[tname];
                action(
                    job.taskDone.bind(job, tname),
                    job.results);
            }
        }

        function is_not_done(name) {
            return job.results[name] === undefined;
        }
    };


    /**
     *
     */
    Job.prototype.jobDone =     function() {
        var job =   this;

        this.logDone("", this.error && this.error.task_name, this.results);

        if (this.error) {
            if (this.error instanceof HandledTaskError) {
                /// do nothing.
            } else if (this.errb) {
                this.errb(this.error, this.results);
            } else if (this.cb) {
                this.cb(this.error, this.results);
            } else {
                this.log("WARN", "No callback or error handler for a job that finished with errors.");
            }
        } else if (this.cb) {
            this.cb(null, this.results);
        }

        this.cb =   false;
        this.errb = false;
    };


    /**
     *
     */
    Job.prototype.options =    function() {
        var job =   this;

        job.log("INFO", "options", arguments);
        arg_map(arguments, function(arg) {
            job.opts = obj_extend(job.opts, arg);
        });

        return this;
    };


    /// Task: ---------------------------------------------------------------------

    /**
     *
     */
    function Task() {

        this.dependencies = [];
        this.action =       false;
        this.fn =           false;
        this.fn_sync =      false;
        this.args =         [];
        this.err_fn =       false;
        this.err_args =     false;
        this.err_exit =     false;
        this.opts =         {};
    };


    /**
     *
     */
    Task.prototype.wait =   function() {

        for (var i=0, len=arguments.length; i<len; i++) {
            if (this.dependencies.indexOf(arguments[i]) === -1) {
                this.dependencies.push(arguments[i]);
            }
        }

        this.recompile();
        return this;
    };


    /**
     *
     */
    Task.prototype.addDepsFromArgs =  function(args) {

        var deps =  args.reduce(function(deps, a) {
            if (a instanceof Request) {
                return deps.concat(a.getDependencies());
            } else {
                return deps;
            }
        }, []);

        this.wait.apply(this, deps);
    };


    /**
     *
     */
    Task.prototype.call =   function(fn) {

        this.fn =       get_fn(fn);
        this.fn_sync =  false;
        this.args =     args_to_array(arguments).slice(1);

        this.addDepsFromArgs(this.args);
        return this;
    };


    /**
     *
     */
    Task.prototype.callSync =   function() {

        this.call.apply(this, arguments);
        this.fn_sync =  true;
        return this;
    };


    /**
     *
     */
    Task.prototype.onError =    function(fn) {

        this.err_fn =   get_fn(fn);
        this.err_args = args_to_array(arguments).slice(1);
        this.err_exit = false;

        this.addDepsFromArgs(this.err_args);
        return this;
    };


    /**
     *
     */
    Task.prototype.exitOnError =    function(fn) {

        this.err_fn =   get_fn(fn);
        this.err_args = args_to_array(arguments).slice(1);
        this.err_exit = true;

        this.addDepsFromArgs(this.err_args);
        return this;
    };


    /**
     *
     */
    Task.prototype.subTasks =   function(result_map, tasks) {

        if (result_map instanceof Array) {
            var mkeys = result_map;
            var mvals = result_map;
        } else {
            var mkeys = Object.getOwnPropertyNames(result_map);
            var mvals = mkeys.map(function(k){ return result_map[k] });
        }

        var fn =    (new Job).extend(tasks).compile(mvals);
        var args =  mkeys.map(function(k){ return (new Request()).get(k); });

        return this.call.apply(this, [].concat(fn, args));
    };


    /**
     *
     */
    Task.prototype.recompile =  function() {
        
        if (this.fn) {
            this.action =   this.compile();
        }
    };


    /**
     *
     */
    Task.prototype.compile =    function() {
        var task =  this;

        return function(cb, results) {

            try {
                var args =      resolve_requests(task.args, results);

                var err_args =  [];
                if (task.err_fn) {
                    err_args =  resolve_requests(task.err_args, results);
                }

                if (task.fn_sync) {
                    myCallback(null, task.fn.apply(task, args));
                } else {
                    args.push(myCallback);
                    task.fn.apply(task, args);
                }
            } catch(e) {
                myCallback(e);
            }

            function myCallback(err, result) {
                
                if (cb && err &&  task.err_fn) {
                    err_args.push(err, result);
                    task.err_fn.apply(task, err_args);
                    err =   wrapError(task, err, result, task.err_exit);
                } else if (err) {
                    err =   wrapError(task, err, result);
                }

                cb &&   cb(err, result);
                cb =    false;
            };
        };
    };


    /**
     *
     */
    Task.prototype.options =    function() {
        var task =  this;

        arg_map(arguments, function(arg) {
            task.opts = obj_extend(task.opts, arg);
        });

        return this;
    };


    /**
     *
     */
    Task.prototype.cache =      function(bucket, id, timeout) {

        throw Error("Task caching is not implemented yet!");
    };


    /// Request: -------------------------------------------------------------------

    /**
     *
     */
    function Request() {};

    /**
     *
     */
    Request.prototype.get =          function(q) {

        this.query =    q;
        return this;
    };


    /**
     *
     */
    Request.prototype.getAll =      function() {

        this.query =    false;
        return this;
    };


    /**
     *
     */
    Request.prototype.apply =       function(fn) {

        this.filter =   fn;
        this.apply =    true;
        this.map =      false;
        return this;
    };


    /**
     *
     */
    Request.prototype.map =         function(fn) {

        this.filter =   fn;
        this.apply =    false;
        this.map =      true;
        return this;
    };


    /**
     *
     */
    Request.prototype.getDependencies =        function() {

        if (!this.query) {
            return [];
        } else if (this.query instanceof Array) {
            return this.query.map(getDependency);
        } else {
            return [getDependency(this.query)];
        }

        /// ...
        function getDependency(q) {
            return q.split(".")[0];
        }
    };


    /**
     *
     */
    Request.prototype.getValue =     function (results) {

        /// Apply filter if needed:
        if (this.filter) {
            if (this.map) {
                return getValue(this.query).map(this.filter);
            } else if (this.apply) {
                if (this.query instanceof Array) {
                    var args =  getValue(this.query);
                } else {
                    var args =  [getValue(this.query)];
                }
                return this.filter.apply(this, args);
            } else {
                throw Error("Unknown filter type " + this.filter);
            }
        } else {
            return getValue(this.query);
        }

        /// Get final value for the request:
        function getValue(query) {
            if (!query) {
                return results;
            } else if (query instanceof Array) {
                return query.map(getValue);
            } else if (query.indexOf(".") === -1) {
                return results[query];
            } else {
                return getValueProperty(query);
            }
        }

        /// Get a value for property query ("result_name.propA.propB...")
        function getValueProperty(query) {
            var q = query.split(".");
            var n = q.shift();
            var r = results[n];
            while (n = q.shift()) {
                if (!r) {
                    throw Error("Missing part for complex Request " + query + ".");
                } else {
                    r = r[n];
                }
            }
            return r;
        }
    };


    /**
     *
     */
    Request.prototype.toTask =       function() {

        return (new Task()).call(
            function(value, cb){ cb(null, value); },
            this);
    };


    /// Utilities: ----------------------------------------------------------------

    /**
     *
     */
    function resolve_requests(args, results) {

        return args.map(function(a){
            if (a instanceof Request) {
                return a.getValue(results);
            } else {
                return a;
            }
        });
    };


    function get_fn(fn) {

        if (fn instanceof Function) {
            return fn;
        } else if (fn.split) {
            var uri =   fn.split("#");
            if (uri.length === 1) {
                var mod =    require(uri[0]);
                if (isLoaded(mod)) {
                    return mod;
                } else {
                    /// Delay loading circular dependencies:
                    return function(){
                        isLoaded(mod) || (mod = require(uri[0]));
                        return mod.apply(mod, arguments);
                    }
                }
            } else {
                var mod =   require(uri[0]);
                if (isLoaded(mod)) {
                    return  mod[uri[1]].bind(mod);
                } else {
                    /// Delay loading circular dependencies:
                    return  function(){
                        isLoaded(mod) || (mod = require(uri[0]));
                        return mod[uri[1]].apply(mod, arguments);
                    }
                }
            }
        } else {
            throw Error("Unrecognized argument to get_fn(): " + fn + ". Please supply a function or URI.");
        }

        /**
         * A check if the module we required was fully loaded
         * (or it loaded empty due to circular dependence):
         */
        function isLoaded(mod) {
            if (mod instanceof Function) {
                return true;
            } else if (Object.getOwnPropertyNames(mod).length === 0) {
                return false;
            } else {
                return true;
            }
        };
    };


    /**
     *
     */
    function args_to_array(args) {
        return Array.prototype.slice.call(args);
    }


    /**
     *
     */
    function arg_map(args, fn) {

        var result = [];
        for (var i=0,argc=args.length; i<argc; i++) {
            result.push(fn(args[i]));
        }
        return result;
    }


    /**
     *
     */
    function obj_extend() {
        
        var argc =  arguments.length;
        var obj = arguments[0];

        for (i=1; i<argc; i++) {
            var arg =   arguments[i];
            for (var k in arg) {
                obj[k] = arg[k];
            }
        }

        return obj;
    }

    /// Job.log(): ----------------------------------------------------------------

    /**
     *
     */
    Job.prototype.log =    function() {

        if (!this.opts.log) return;

        var args =  args_to_array(arguments);
        var msg =   args.shift();

        var formatted = {
            INFO:   colorString("INFO", "white"),
            EXEC:   colorString("EXEC", "yellow"),
            VALUE:  colorString("VAL ", "green"),
            FUNC:   colorString("FUNC", "green"),
            DONE:   colorString("DONE", "green"),
            LATE:   colorString("LATE", "magenta"),
            WARN:   colorString("WARN", "magenta"),
            ERROR:  colorString("ERR ", "red"),
            TIMEOUT:colorString("TIME", "red"),
            DEBUG:  colorString("DBUG", "grey"),
        };

        if (this.opts.id) {
            if (msg === "EXEC" || msg === "DONE") {
                args.unshift(colorString(this.opts.id, "underline"));
            } else {
                args.unshift(this.opts.id);
            }
        }

        args.unshift(
            colorString("Task", "white"),
            formatted[msg]);

        console.log.apply(console, args);
    };

    /**
     *
     */
    Job.prototype.logDone =   function(name, err, result) {

        if (!this.opts.log) return;

        var msg =   [ colorString("Task", "white") ];

        msg.push(colorString("DONE", (err ? "red" : "green")));
        msg.push(colorString(this.opts.id + "#" + name, "underline"));

        if (!err && err !== "") {
            msg.push(colorString(err, "green"));
        } else if (err === "") {
            msg.push(colorString('String("")', "yellow"));
        } else {
            msg.push(colorString(typeof(err), "red"));
        }

        msg.push(colorString(typeof(result), (!!result ? "green" : "yellow")));

        console.log.apply(console, msg);
    };




    /// Colors: -------------------------------------------------------------------


    var colors = {
        reset:      '\u001b[0m',

        bold:       '\u001b[1m',
        italic:     '\u001b[3m',
        underline:  '\u001b[4m',
        blink:      '\u001b[5m',
        inverse:    '\u001b[7m',
        hidden:     '\u001b[8m',

        black:      '\u001b[30m',
        red:	    '\u001b[31m',
        green:	    '\u001b[32m',
        yellow:	    '\u001b[33m',
        blue:	    '\u001b[34m',
        magenta:	'\u001b[35m',
        cyan:	    '\u001b[36m',
        white:	    '\u001b[37m',
        grey:       '\u001b[38m',

        black_bg:	'\u001b[40m',
        red_bg:	    '\u001b[41m',
        green_bg:	'\u001b[42m',
        yellow_bg:	'\u001b[43m',
        blue_bg:	'\u001b[44m',
        magenta_bg:	'\u001b[45m',
        cyan_bg:	'\u001b[46m',
        white_bg:	'\u001b[47m',

    };

    function colorString(str, style) {

        if ( typeof(process) !== "undefined" && process && process.env && process.env.COLORTERM ) {
            return colors[style] + str + colors["reset"];
        } else {
            return str;
        }
    };


    /// Errors: -------------------------------------------------------------------

    /**
     *
     */
    function wrapError(task, err, results, handled) {

        if (!err || (err instanceof TaskError) || (err instanceof HandledTaskError)) {
            return err;
        } else if (handled) {
            return new HandledTaskError(task, err, results);
        } else {
            return new TaskError(task, err);
        }
    };

    /**
     *
     */
    function TaskError(task, err, results) {

        this.task =     task;
        //this.task_id =  task.id;
        this.error =    err;
        this.results =  results;
    };


    /**
     *
     */
    function HandledTaskError(task, err, results) {
        
        TaskError.call(this, task, err, results);

        this.handled =  true;
    };

    /// Exports for various platforms: -----------------------------------------

    // AMD / RequireJS
    if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return root.goodJob;
        });
    }
    // Node.js
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = root.goodJob;
    }
    // included directly via <script> tag
    else {
        /// root.goodJob = goodJob;
    }

}());
