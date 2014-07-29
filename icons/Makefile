A=inkscape --export-area-page --export-width=
B=--export-height=
C=--export-png=$@ $^

all: \
30.png \
30@2x.png \
60.png \
60@2x.png \
90.png \
90@2x.png \
120.png \
120@2x.png \
240.png \
32.png \
64.png \
128.png \
256.png

30.png: 	icon.svg; $A30 $B30 $C
30@2x.png:	icon.svg; $A60 $B60 $C
60.png:		icon.svg; $A60 $B60 $C
60@2x.png:	icon.svg; $A120 $B120 $C
90.png:		icon.svg; $A90 $B90 $C
90@2x.png:	icon.svg; $A180 $B180 $C
120.png: 	icon.svg; $A120 $B120 $C
120@2x.png:	icon.svg; $A240 $B240 $C
240.png: 	icon.svg; $A240 $B240 $C
32.png: 	icon.svg; $A32 $B32 $C
64.png: 	icon.svg; $A64 $B64 $C
128.png: 	icon.svg; $A128 $B128 $C
256.png: 	icon.svg; $A256 $B256 $C

