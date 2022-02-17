const Event = require('./../../structures/Event')
const reactSchema = require('./../../models/reactRoles')
const serverSchema = require('./../../models/serverSchema')

module.exports = class extends Event {
	async run(messageReaction, user) {
		const { message } = messageReaction
		const { guild } = message
		if (!guild || user.bot) return

		const doc = await reactSchema.findOne({ guildId: guild.id, messageId: message.id })
		if (!doc) return

		const { roledm } = await serverSchema.findOne({ guildId: guild.id })

		const { emoji } = messageReaction
		const { roles, toggle } = doc
		if (!roles.has(messageReaction.emoji.id) && !roles.has(emoji.name)) return

		const roleID = emoji.id === null ? roles.get(emoji.name) : roles.get(emoji.id)
		const role = guild.roles.resolve(roleID)

		const member = await guild.members.resolve(user)
		if (!member?.manageable) return

		if (toggle)
			for (const r of roles)
				if (member.roles.cache.has(r.id) && r.id !== roleID) await member.roles.remove(r)

		await member.roles.add(roleID)
		if (roledm) return user.send(`Added role \`${role.name}\` in ${guild.name}`)
	}
}