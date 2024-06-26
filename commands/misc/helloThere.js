const { EmbedBuilder, Colors, SlashCommandBuilder } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/statics')

const gif = 'https://cdn.discordapp.com/attachments/716088303622946846/737578683203584030/Hello_There.gif'

module.exports = {
    data: new SlashCommandBuilder().setName('hello_there').setDescription('Sends a gif from Star Wars'),
	async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Hello There')
            .setURL(gif)
            .setImage(gif)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp()
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		await interaction.reply({ embeds: [embed] })
	}
}