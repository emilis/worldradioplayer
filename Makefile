.PHONY:	default static zip

### Vars -----------------------------------------------------------------------

YAML2JSON=python -c "import sys, yaml, json; json.dump(yaml.load(sys.stdin), sys.stdout, indent=4)"


### Main -----------------------------------------------------------------------

default: static


### Application.zip: -----------------------------------------------------------

zip: application.zip


application.zip: \
default \
index.html \
manifest.webapp \
Makefile
	zip -r application.zip static/ index.html manifest.webapp


### Static files: --------------------------------------------------------------

static: \
static/style.css \
static/scripts.js \
icons


icons:
	$(MAKE) -C static/img/icons/ > /dev/null


### CSS: -----------------------------------------------------------------------

static/style.css: \
static/css/*.less \
static/fonts/awesome/font-awesome.css
	lessc -x static/css/style.less $@


### JS: ------------------------------------------------------------------------

### All JS files are joined into one.
### The order of the dependencies is important!
#
static/scripts.js: \
static/js/lib/underscore.js \
static/js/lib/zepto.js \
static/js/lib/buzz.js \
static/js/app.js \
static/js/stations.js \
static/js/sound-player.js \
static/js/player.js \
static/js/station-list.js \
static/js/explorer.js
	cat $^ > "$@"


### App.Stations Array is created from data in a YAML file:
#
static/js/stations.js: \
static/js/data/xiph.org.stations.json
	echo ";App.Stations=" > $@
	# $(YAML2JSON) < $^ >> $@
	cat $^ >> $@
	echo ";" >> $@

