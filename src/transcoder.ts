import Client from './client';

import ytdl = require('ytdl-core');
import ffmpeg = require('fluent-ffmpeg');


export default class Transcoder {
	private readonly _client: Client;
	private readonly _options: ytdl.downloadOptions;

	constructor(client: Client, options?: ytdl.downloadOptions) {
		this._client =  client;
		this._options = options;
	}

	/**
	 * Download audio from internet source
	 * @param url URL to audio
	 */
	public async download(url: string) {
		const info = ytdl.getBasicInfo(url, (err, info) => {
			if(err) {
				throw err;
			}

			this._client.sendMessage(`Download of <b>${info.title}</b> started...`);
			return info;
		})
		const filePath = `./audio/${(await info).video_id}.mp3`;

		const stream = ytdl(url, {
			quality: 'highestaudio'
		});

		return new Promise<string>(resolve => {
			ffmpeg(stream)
				.audioBitrate(128)
				.save(filePath)
				.on('end', () => {
					resolve(filePath);
				})
		})
			

	}
}