import Mumble = require('mumble');

export default class Client {
	private readonly _username: string;
	private readonly _comment: string;
	private readonly _options: Mumble.Options;

	constructor(username: string, comment?: string, options?: Mumble.Options) {
		this._username = username;
		this._comment = comment;
		this._options = options;
	}

	public connect(address: string, password: string, callback: (client: Mumble.Connection) => void) {
		Mumble.connect(address, this._options, (err, connection) => {
			if(err) {
				throw err;
			}

			connection.authenticate(this._username, password);
			connection.on('initialized', () => {
				callback(connection);
			})
		});
	}
}