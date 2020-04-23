import Lame = require('node-lame');
import Samplerate = require('node-samplerate');

import { Connection, InputStream } from 'mumble'
import { read, closeSync, unlinkSync, openSync, PathLike } from 'fs';

export default class Player {
	private _connection: Connection;
	private _gain: number;
	private _buffer: Buffer;
	private _stream: InputStream;
	private _fileStream: number;
	private _filePath: PathLike;
	private _promise: any;

	public isPlaying: boolean;

	constructor(connection: Connection) {
		this._connection = connection;
		this._gain = 0.25;
		this._buffer = Buffer.alloc(48000);
		this.isPlaying = false;
		this._createStream();
	}

	/**
	 * Create a readable stream to output to client
	 */
	private _createStream() {
		this._stream = this._connection.inputStream();
		this._stream.setGain(this._gain);
		this._stream.on('drain', () => {
			this._fillBuffer()
		})
	}

	/**
	 * Create buffer with content from stream
	 */
	private _fillBuffer() {
		if(this.isPlaying) {
			read(this._fileStream, this._buffer, 0, 48000, null, (err, bytesRead, buffer) => {
				if(err) {
					throw err;
				}

				if(bytesRead == 0) {
					console.info('Song timeout');
					this.isPlaying = false;
					this._delete();
					setTimeout(this._promise.resolve, 500);
				} else {
					const decoder = new Lame.Lame({
						"output": "buffer",
					}).setBuffer(buffer.slice(0, bytesRead))

					decoder.decode()
						.then(() => {
							// Decoding finished
							const newBuffer = decoder.getBuffer();
							const resampled = Samplerate.resample(newBuffer, 48000, 24000, 1);
							this._stream.write(resampled);
						})
						.catch((err) => {
							throw err;
						})
					if (bytesRead < 48000) {
						this._fillBuffer();
					}
				}
			})
		}
	}

	/**
	 * Close file stream
	 */
	private _delete() {
		try {
			closeSync(this._fileStream);
			unlinkSync(this._filePath);
		} catch(e) {
			return e;
		}
	}

	/**
	 * Play a file from path
	 * @param filename Path to file to play
	 */
	public playFile(filename: PathLike) {
		if(!this.isPlaying) {
			return new Promise((res, rej) => {
				this._promise = {
					resolve: res,
					reject: rej
				};
				this._filePath = filename;
				this.isPlaying = true;
				this._fileStream = openSync(filename, 'r', 666);
				this._fillBuffer();
			})
		}
	}
}