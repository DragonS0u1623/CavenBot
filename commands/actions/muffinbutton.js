const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/statics')

const gif = `https://cdn.discordapp.com/attachments/716088303622946846/746103226008600657/muffin_button.gif`

module.exports = {
    data: new SlashCommandBuilder().setName('muffin_button')
		.setDescription('Sends a DBZA meme of the muffin button'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Muffin Button')
            .setImage(gif)
            .setURL(gif)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp()
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
        await interaction.reply({ embeds: [embed] })
    }
}