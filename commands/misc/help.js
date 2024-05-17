const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder().setName('help').setDescription('Get a list of commands'),
	async execute(interaction) {
        const invite = 'https://cavenbot-website.vercel.app/commands'
		await interaction.reply(invite)
	}
}