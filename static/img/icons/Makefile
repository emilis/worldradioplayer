A=inkscape --export-area-page --export-width=
B=--export-height=
C=--export-png=$@ $^

all: \
30.png \
60.png \
99.png \
100.png \
128.png \
256.png

30.png: icon.svg; $A30 $B30 $C
60.png: icon.svg; $A60 $B60 $C
99.png:	icon.svg; $A99 $B99 $C
100.png: icon.svg; $A100 $B100 $C
128.png: icon.svg; $A128 $B128 $C
256.png: icon.svg; $A256 $B256 $C

