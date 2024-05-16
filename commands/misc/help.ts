import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export default {
	data: new SlashCommandBuilder().setName('help').setDescription('Get a list of commands'),
	async run(interaction: ChatInputCommandInteraction) {
        const invite = 'https://cavenbot-website.vercel.app/commands'
		await interaction.reply(invite)
	}
}