const Event = require('../../structures/Event.js')

module.exports = class extends Event {
	async run(interaction) {
		if (!interaction.isCommand()) return

		const command = this.client.slashCommands.get(interaction.commandName)

		if (!command) return

		try {
			await command.executeSlash(interaction)
		} catch (error) {
			console.error(error)
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	}
}