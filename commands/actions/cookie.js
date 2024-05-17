const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/statics')

const cookie = `https://cdn.discordapp.com/emojis/709783068881190932.png?v=1`

module.exports = {
    data: new SlashCommandBuilder().setName('cookie')
		.setDescription('Gives a cookie to someone')
        .addUserOption(option => option.setName('target').setDescription('The person you want to give a cookie').setRequired(false)),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.displayName} gives a cookie to everyone`)
            .setDescription(`[Link to image](${cookie})`)
            .setImage(cookie)
            .setColor(Colors.NotQuiteBlack)
            .setTimestamp()
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })

        const user = interaction.options.getUser('target')
        if (user != null) embed.setTitle(`${interaction.user.displayName} gives a cookie to ${user.displayName}`)
        await interaction.editReply({ embeds: [embed] })
    }
}