![GitHub package.json version](https://img.shields.io/github/package-json/v/strid3r2442/groovebot?color=darkred&style=flat-square)
![GitHub](https://img.shields.io/github/license/strid3r2442/groovebot?style=flat-square)
![Maintenance](https://img.shields.io/maintenance/yes/2020?style=flat-square)

# Groovebot

Groovebot is a music bot for Mumble written in Node, utilising ytdl, ffmpeg and LAME.

Please note that Groovebot is currently in very early development. Many features are missing and many bugs are present.

## Installation
Ensure you have [ffmpeg](http://www.ffmpeg.org/) installed on your system.

Clone repo and install via npm

```bash
npm install
```

## Usage

```typescript
import Client from './client';

const client = new Client('Groovebot');
const ip = '127.0.0.1';
const password = 'abc123'

client.connect(ip, password, (connection) => {})
```

Groovebot will join the root channel and be ready to listen to commands

## Upcoming features

* Queue system
* Web interface
* Local file support
* Configuration file
* Caching system

Feel free to request any new features by raising an [issue](https://github.com/Strid3r2442/groovebot/issues/new)

## Contributing
Pull requests and forks are welcome.

## License
Groovebot is licensed under the [MIT](https://choosealicense.com/licenses/mit/) license.