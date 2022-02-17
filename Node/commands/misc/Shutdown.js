const Command = require('../../structures/Command')

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'shutdown',
			aliases: ['sd'],
			description: 'Shuts down the bot',
			ownerOnly: true,
			guildOnly: false,
			hidden: true
		})
	}

	async run(message) {
		const reply = ':warning: Shutting down now :warning:'
		await message.channel.send(reply)
		for (const guild of this.client.guilds.cache) this.client.manager.destroy(guild.id)
		this.client.manager.destroyNode('default')
		this.client.destroy()
	}
}