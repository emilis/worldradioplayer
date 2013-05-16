.PHONY:	default static zip

### Vars -----------------------------------------------------------------------

YAML2JSON=python -c "import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)"

### Main -----------------------------------------------------------------------

default: static

zip: application.zip

application.zip: \
default \
index.html \
manifest.webapp \
Makefile
	zip -r application.zip static/ index.html manifest.webapp

### Static files: --------------------------------------------------------------

static: \
static/css/style.css \
static/js/scripts.js \
icons

icons:
	$(MAKE) -C static/img/icons/ > /dev/null

### CSS: -----------------------------------------------------------------------

static/css/style.css: \
static/css/style.less \
static/css/vars.less \
static/fonts/awesome/font-awesome.css \
static/css/base.less \
static/css/player.less \
static/css/responsive.css
	lessc -x static/css/style.less $@

### JS: ------------------------------------------------------------------------

static/js/stations.json:\
static/js/stations.yml
	$(YAML2JSON) < $^ > $@

static/js/stations.js: \
static/js/stations.json
	echo ";App.Stations=" > $@
	cat $^ >> $@
	echo ";" >> $@

static/js/scripts.js: \
static/js/lib/underscore.js \
static/js/lib/zepto.js \
static/js/lib/buzz.js \
static/js/app.js \
static/js/stations.js \
static/js/player.js \
static/js/views.js \
static/js/main.js
	cat $^ > "$@"
