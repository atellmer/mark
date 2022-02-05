class Logger {
	private isLogEnabled = false;

	constructor(isLogEnabled: boolean) {
		this.isLogEnabled = isLogEnabled;
	}

	public setIsLogEnabled(value: boolean) {
		this.isLogEnabled = value;
	}

	public log(...args) {
		if (this.isLogEnabled) {
			console.log(...args);
		}
	}
}

export { Logger };
