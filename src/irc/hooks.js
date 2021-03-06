export default class Hooks {
	constructor() {
		this._hooks = {};
		this._preInitKey = '%PREINIT%';
		this._postInitKey = '%POSTINIT%';
		this._closingKey = '%CLOSING%';

		// Do post-init hooks when the server sends 001
		this.add('001', this._doPostInit.bind(this));
	}

	add(command, func) {
		const hook = this._hooks[command];
		if (typeof hook === 'undefined' || hook === null)
			this._hooks[command] = [func];
		else if (!hook.find(elem => elem === func))
			this._hooks[command].push(func);
	}

	addPreInit(func) {
		this.add(this._preInitKey, func);
	}

	addPostInit(func) {
		this.add(this._postInitKey, func);
	}

	addClosing(func) {
		this.add(this._closingKey, func);
	}

	runPreInitHooks(server) {
		console.log('Running pre-init hooks for ' + server.info.name + '.');
		this._runHook(this._preInitKey, server, null);
	}

	runPostInitHooks(server) {
		console.log('Running post-init hooks for ' + server.info.name + '.');
		this._runHook(this._postInitKey, server, null);
	}

	runClosingHooks(server) {
		console.log('Running closing hooks for ' + server.info.name + '.');
		this._runHook(this._closingKey, server, null);
	}

	runHooks(server, msgData) {
		this._runHook('*', server, msgData);
		this._runHook(msgData.command, server, msgData);
	}

	_runHook(command, server, msgData) {
		if (this._hooks[command])
			this._hooks[command].forEach(async (f) => f(server, msgData));
	}

	_doPostInit(server) {
		this.runPostInitHooks(server);
	}
}
