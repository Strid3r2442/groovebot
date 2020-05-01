// Typescript doesn't think file exists, ignorning error
// @ts-ignore
import lame = require('@suldashi/lame');

import Transcoder from './transcoder';
import Queue from './queue';
import { Connection, InputStream } from 'mumble'
import { PathLike, createReadStream } from 'fs';

export default class Player {
	private _connection: Connection;
	private _gain: number;
	private _stream: InputStream;
	private _transcoder: Transcoder;
	private _queue: Queue;

	public isPlaying: boolean;

	constructor(connection: Connection) {
		this._connection = connection;
		this._transcoder = new Transcoder(this._connection);
		this._queue = new Queue();
		this._gain = 0.1;
		this.isPlaying = false;
		this._createStream();
	}

	/**
	 * Create a readable stream to output to client
	 */
	private _createStream() {
		this._stream = this._connection.inputStream();
		this._stream.setGain(this._gain);
	}

	private async _transcode(url: string, playAfterFinish = false) {
		const filePath = await this._transcoder.download(url);
		if(playAfterFinish) {
			this.playFile(filePath);
		}
	}

	/**
	 * Play a file from path
	 * @param filename Path to file to play
	 */
	public playFile(filename: PathLike) {
		const decoder = lame.Decoder();

		decoder.on('format', (format) => {
			this._stream.channels = format.channels;
			this._stream.sampleRate = format.sampleRate;
		})

		createReadStream(filename) // Create a read stream of the file
			.pipe(decoder) // Pipe the read stream to the decoder
			.pipe(this._stream)  // Pipe the decoded stream to Mumble
	}

	public addSong(url: string) {
		if(this._queue.isEmpty()) {
			this._queue.add(url);
			this._transcode(url, true);
		} else {
			this._queue.add(url);
		}
	}
}