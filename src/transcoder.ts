import ytdl = require('ytdl-core');
import ffmpeg = require('fluent-ffmpeg');

export default class Transcoder {
	private readonly _options: ytdl.downloadOptions;

	constructor(options?: ytdl.downloadOptions) {
		this._options = options;
	}

	/**
	 * Download audio from internet source
	 * @param url URL to audio
	 */
	public download(url: string) {
		const stream = ytdl(url, {
			quality: 'highestaudio'
		});

		ffmpeg(stream)
			.audioBitrate(128)
			.save('./audio/test.mp3')
			.on('end', () => {
				console.log('done')
			})

	}
}