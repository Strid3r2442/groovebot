export default class Queue {
	private _queue: string[];

	constructor(){
		this._queue = [];
	}

	public next() {
		return this._queue[1];
	}

	public clear() {
		this._queue = [];
	}

	public remove(item: number) {
		this._queue.splice(item, 1);
	}

	public add(song: string) {
		this._queue.push(song);
	}

	public isEmpty(): boolean {
		return !(this._queue.length > 0);
	}
}