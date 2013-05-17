# ![Icon][icon] World Radio Player

A player for Internet radio stations on Firefox OS.

*Not published on the Marketplace yet.*

## Usage

Push to your device via Firefox OS Simulator or run in the simulator itself.

To create an `application.zip` file:
``` bash
$ make zip
```

## Known issues / roadmap

- Only the first 20 stations from dir.xiph.org are shown.
- Only OGG streams are supported at the moment.
- Playback may stop when song changes.
- Home screen should show a list of last played / favorite stations.
- No station search / filter by genre.
- No song name shown for currently playing station.

## About

### Author

- Emilis Dambauskas <emilis.d@gmail.com>.

### Thanks

- Fabrice Desré <https://github.com/fabricedesre> for b2gremote and help with Firefox OS simulator.
- Thomas B. Ruecker <https://github.com/dm8tbr> for getting the list of stations from <http://dir.xiph.org/>.

### License

    World Radio Player
    Copyright (C) 2013 Emilis Dambauskas, emilis.d@gmail.com

    World Radio Player is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    World Radio Player is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


[icon]: https://raw.github.com/emilis/worldradioplayer/master/static/img/icons/30.png
