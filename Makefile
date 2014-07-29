.PHONY:	default clean static zip data build-tools xml2json


### Main -----------------------------------------------------------------------

default: static icons data


clean:
	rm application.zip


### Application.zip: -----------------------------------------------------------

zip: application.zip


application.zip: \
default \
index.html \
manifest.webapp \
Makefile
	zip -r application.zip static/ icons/ index.html manifest.webapp


### Static files: --------------------------------------------------------------

static: \
static/style.css


icons:
	$(MAKE) -C icons/ > /dev/null


### CSS: -----------------------------------------------------------------------

static/style.css: \
static/css/*.less
	lessc -x static/css/style.less $@

### Data: ----------------------------------------------------------------------

data: \
static/data \
static/data/dir.xiph.org.yp.json

static/data:
	mkdir -p static/data

static/data/dir.xiph.org.yp.json: \
static/data/dir.xiph.org.yp.xml
	cat "$<" | node xml2json > "$@"

static/data/dir.xiph.org.yp.xml:
	curl 'http://dir.xiph.org/yp.xml' > "$@"

### Prerequisites: -------------------------------------------------------------

build-tools: \
xml2json

xml2json:
	npm install -g 'git://github.com/buglabs/node-xml2json.git'
