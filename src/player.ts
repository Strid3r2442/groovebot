// Typescript doesn't think file exists, ignorning error
// @ts-ignore
import lame = require('@suldashi/lame');

import { Connection, InputStream } from 'mumble'
import { PathLike, createReadStream } from 'fs';

export default class Player {
	private _connection: Connection;
	private _gain: number;
	private _stream: InputStream;

	public isPlaying: boolean;

	constructor(connection: Connection) {
		this._connection = connection;
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

		createReadStream(filename).pipe(decoder).pipe(this._stream)
	}
}