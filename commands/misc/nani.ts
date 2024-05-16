import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { FOOTER, OWNERPFP } from '../../utils/statics'

const gif = 'https://cdn.discordapp.com/attachments/640674672618373132/711291888594059354/tenor-4.gif'

export default {
    data: new SlashCommandBuilder().setName('nani').setDescription('Sends a gif from anime'),
    async executeSlash(interaction: ChatInputCommandInteraction) {
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