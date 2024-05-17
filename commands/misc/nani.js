const { Colors, EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/statics')

const gif = 'https://cdn.discordapp.com/attachments/640674672618373132/711291888594059354/tenor-4.gif'

module.exports = {
    data: new SlashCommandBuilder().setName('nani').setDescription('Sends a gif from anime'),
    async execute(interaction) {
        await interaction.deferReply()

        const embed = new EmbedBuilder()
            .setTitle('NANI!!!!!!!')
            .setURL(gif)
            .setImage(gif)
            .setColor(Colors.Yellow)
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
        await interaction.editReply({ embeds: [embed] })
    }
}