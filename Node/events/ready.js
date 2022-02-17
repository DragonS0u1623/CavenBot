const Event = require('../structures/Event.js')

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			once: true
		})
	}

	async run() {
		console.log([
			`Logged in as ${this.client.user.username}`,
			`Loaded ${this.client.commands.size} commands`,
			`Loaded ${this.client.events.size} events`
		].join('\n'))

		this.client.utils.updateStatus()
	}
}