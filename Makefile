### Variables -----------------------------------------------------------------

BOWER=					./node_modules/.bin/bower
STARK=					./node_modules/.bin/stark
XML2JSON=				./node_modules/.bin/xml2json

### Tasks ---------------------------------------------------------------------

.PHONY: default
default: data icons build


.PHONY:  build
build:\

	${STARK} build
	cp -r icons build/icons


.PHONY:	zip
zip:	application.zip



.PHONY:  run
run:\

	${STARK} watch-server


.PHONY:  setup
setup:\

	npm install
	${BOWER} install


.PHONY:  clean
clean:\

	rm application.zip


### Targets -------------------------------------------------------------------

application.zip:\
	build\

	cd build && zip -r ../application.zip index.html static/ icons/ manifest.webapp


.PHONY:  icons
icons:

	$(MAKE) -C icons/ > /dev/null


### Data ----------------------------------------------------------------------

.PHONY:  data
data:\
	static/data\
	static/data/dir.xiph.org.yp.json\


static/data:\

	mkdir -p static/data


static/data/dir.xiph.org.yp.json:\
	static/data/dir.xiph.org.yp.xml\

	cat "$<" | ${XML2JSON} > "$@"


static/data/dir.xiph.org.yp.xml:\

	curl 'http://dir.xiph.org/yp.xml' > "$@"

