import Player from './player';
import Transcoder from './transcoder';

import Mumble = require('mumble');
import { PathLike } from 'fs';

export default class Client {
	private readonly _username: string;
	private readonly _comment: string;
	private readonly _options: Mumble.Options;
	private _connection: Mumble.Connection;
	private _player: Player;
	private _transcoder: Transcoder;

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
				this._connection = connection;
				this._player = new Player(this._connection);
				this._transcoder = new Transcoder(this);
				callback(this._connection);
			})
			connection.on('message', (msg, user) => {
				if(msg.startsWith('!')) {
					const cmd = msg.substring(1);
					return this._onMessage(cmd, user)
				}
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

	/**
	 * Send a message to the current channel
	 * @param msg Message to be sent
	 */
	public sendMessage(msg: string) {
		const channel = this._connection.user.channel;
		channel.sendMessage(msg);
	}

	/**
	 * Message listener
	 * @param msg The message received
	 * @param user User that sent the message
	 */
	private async _onMessage(msg: string, user: Mumble.User) {
		const channel = this._connection.user.channel;
		// Strip HTML tags from message
		msg = msg.replace(/(<([^>]+)>)/ig,"");

		const cmd = msg.split(' ')[0];
		const args = msg.split(' ').slice(1);

		switch(cmd) {
			case 'play':
				if(args.length > 1) {
					channel.sendMessage('Invalid arguments');
					break;
				}

				try {
					const filePath = await this._transcoder.download(args[0]);
					this.playFile(filePath);
				} catch(e) {
					console.log(e);
					channel.sendMessage('An error occured whilst attempting to download file')
				}
				break;
				
			default:
				channel.sendMessage('Command not found');
		}
	}
}