A=inkscape --export-area-page --export-width=
B=--export-height=
C=--export-png=$@ $^

all: *.png

128.png: icon.svg; $A128 $B128 $C
256.png: icon.svg; $A256 $B256 $C

