const Event = require('../../structures/Event.js')
const adminSchema = require('../../models/admin.js')
const serverSchema = require('../../models/serverSchema.js')

module.exports = class extends Event {
	async run(guild) {
		await adminSchema.deleteOne({ guildId: guild.id })
		await serverSchema.deleteOne({ guildId: guild.id })
	}
}