const Command = require('../../structures/Command')
const serverSchema = require('../../models/serverSchema')

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'prefix',
			category: 'Misc',
			description: 'Changes the prefix for the guild.',
			expectedArgs: '[new prefix]'
		})
	}

	async run(message, args) {
		const { guild } = message
		if (!args.length) return message.channel.send(`You need to give a new prefix to use for this command.`)

		const prefix = args.shift()

		await serverSchema.findOneAndUpdate({ guildId: guild.id }, { prefix })
		return message.channel.send(`Prefix for this server changed to ${prefix}`)
	}
}