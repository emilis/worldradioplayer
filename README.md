# <img src="https://raw.github.com/emilis/worldradioplayer/master/icons/60.png" align="right"> World Radio Player

A player for Internet radio stations on [Firefox OS][].

## Usage

Install it from [![Firefox Marketplace][marketplace-logo]][marketplace-link]

### Development

Checkout this repository and install/use via the [Firefox OS Simulator][simulator].

You will need [Node.js][node] and a version of [Make][make] to build this app. Also lessc, curl and zip on the command line.

To start developing, run:
```bash
$ make build-tools
$ make
```

To create an `application.zip` file:
``` bash
$ make zip
```

## Known issues / roadmap

- ~~Only OGG streams are supported at the moment.~~
- ~~Operations involving IndexedDB tage ages...~~
- ~~Stream download is not stopped when station is stopped.~~
- ~~Playback may stop when song changes.~~
- ~~Playback stops but stream download continues when app is minimized.~~
- Need to improve responsiveness on first app start.
- Network status is not shown for playing station ( buffering/playing/etc. ).
- Playback interruptions due to new metadata are not handled properly and may cause problems when switching playing stations.
- No song name shown for currently playing station.

## About

### Author, contributors

- **Emilis Dambauskas <emilis.d@gmail.com>.**
- [Jerzy Kozera][jkozera].

### Thanks

- [Fabrice Desré][fabricedesre] for b2gremote and help with Firefox OS simulator.
- [Thomas B. Ruecker][dm8tbr] for getting the list of stations from <http://dir.xiph.org/>.
- [Marketplace Reviewers][] for reviewing the app before my presentation.

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

[Firefox OS]: https://www.mozilla.org/en-US/firefox/partners/#os "Firefox OS"
[marketplace-link]: https://marketplace.firefox.com/app/world-radio-player/ "World Radio Player"
[marketplace-logo]: https://raw.github.com/emilis/worldradioplayer/master/static/img/marketplace-logo.png "Firefox Marketplace"
[simulator]: https://addons.mozilla.org/en-US/firefox/addon/firefox-os-simulator/ "Firefox OS Simulator"
[fabricedesre]: https://github.com/fabricedesre "Fabrice Desré"
[dm8tbr]: https://github.com/dm8tbr "Thomas B. Ruecker"
[Marketplace Reviewers]: https://wiki.mozilla.org/Marketplace/Reviewers "Marketplace Reviewers"
[jkozera]: https://github.com/jkozera "Jerzy Kozera"
[node]: http://nodejs.org/ "Node.js"
[make]: https://en.wikipedia.org/wiki/Make_%28software%29 "Make"
