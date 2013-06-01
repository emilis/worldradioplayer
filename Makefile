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
icons


icons:
	$(MAKE) -C static/img/icons/ > /dev/null


### CSS: -----------------------------------------------------------------------

static/style.css: \
static/css/*.less
	lessc -x static/css/style.less $@


