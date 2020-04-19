import Player from './player';
import Mumble = require('mumble');
import { PathLike } from 'fs';

export default class Client {
	private readonly _username: string;
	private readonly _comment: string;
	private readonly _options: Mumble.Options;
	private _player: Player;

	constructor(username: string, comment?: string, options?: Mumble.Options) {
		this._username = username;
		this._comment = comment;
		this._options = options;
	}

	/**
	 * Connect the client to a server
	 * @param address Address of the server you wish to connect to
	 * @param password Password of the server you wish to connect to
	 * @param callback Callback once client has connected with connection object
	 */
	public connect(address: string, password: string, callback: (client: Mumble.Connection) => void) {
		Mumble.connect(address, this._options, (err, connection) => {
			if(err) {
				throw err;
			}

			connection.authenticate(this._username, password);
			connection.on('initialized', () => {
				this._player = new Player(connection);
				callback(connection);
			})
		});
	}

	/**
	 * Play a file
	 * @param filename Path to a file
	 */
	public playFile(filename: PathLike) {
		this._player.playFile(filename);
	}
}