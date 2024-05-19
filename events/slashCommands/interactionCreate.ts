import { BaseInteraction, Client, Events } from 'discord.js'
import { CavenBot } from '../../types/types.js'

export default {
	name: Events.InteractionCreate,
	once: false,
	async execute(client: Client, interaction: BaseInteraction) {
		console.log(interaction)
		if (!interaction.isChatInputCommand()) return

		const command = (client as CavenBot).commands.get(interaction.commandName)

		if (!command) return

		try {
			await command.execute(interaction)
		} catch (error) {
			console.error(error)
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	}
}