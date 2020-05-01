import Client from './client';

import ytdl = require('ytdl-core');
import ffmpeg = require('fluent-ffmpeg');
import { Connection } from 'mumble';
import { existsSync, mkdirSync } from 'fs';

export default class Transcoder {
	private readonly _connection: Connection;
	private readonly _options: ytdl.downloadOptions;

	constructor(connection: Connection, options?: ytdl.downloadOptions) {
		this._connection =  connection;
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

			Client.sendMessage(`Download of <b>${info.title}</b> started...`, this._connection);
			return info;
		})
		const filePath = `./audio/${(await info).video_id}.mp3`;

		if (!existsSync('./audio/')){
			mkdirSync('./audio/');
	}

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