const Event = require('../../structures/Event.js')
const adminSchema = require('../../models/admin.js')
const serverSchema = require('../../models/serverSchema.js')

module.exports = class extends Event {
	async run(guild) {
		new adminSchema({
			guildId: guild.id,
			audits: '0',
			welcome: '0',
			// eslint-disable-next-line camelcase
			welcome_message: 'Welcome to the server',
			language: 'en_US'
		}).save()
		new serverSchema({
			guildId: guild.id,
			prefix: 'm?',
			welcome: false,
			audits: false,
			roledm: true,
			joinrole: false
		}).save()
	}
}