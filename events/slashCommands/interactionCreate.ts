import { Events, Interaction } from 'discord.js'
import { CavenBot } from '../../types/types' // Replace '../CavenBot' with the correct path to the module that exports the 'CavenBot' type

export default {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction: Interaction) {
		if (!interaction.isChatInputCommand()) return

		const client = interaction.client as CavenBot

		const command = client.commands.get(interaction.commandName)

		if (!command) return

		try {
			await command.execute(interaction)
		} catch (error) {
			console.error(error)
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	}
}