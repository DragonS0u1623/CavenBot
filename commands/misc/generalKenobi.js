const { Colors, EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/statics')

const gif = 'https://cdn.discordapp.com/attachments/716088303622946846/737578915236937768/general_Grievous.gif'

module.exports = {
    data: new SlashCommandBuilder().setName('general_kenobi').setDescription('Sends a gif from Star Wars'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('General Kenobi')
            .setURL(gif)
            .setImage(gif)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp()
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		await interaction.reply({ embeds: [embed] })
	}
}