const { Colors, EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/statics')

const gif1 = 'https://cdn.discordapp.com/attachments/640674672618373132/647205970442846220/20191121_172359.jpg'
const gif2 = 'https://cdn.discordapp.com/attachments/640674672618373132/711291888594059354/tenor-4.gif'

module.exports = {
    data: new SlashCommandBuilder().setName('omae').setDescription('Sends a gif from anime'),
	async execute(interaction) {
        await interaction.deferReply()

        let embed = new EmbedBuilder()
            .setTitle('Omae wa mou shindeiru')
            .setURL(gif1)
            .setImage(gif1)
            .setColor(Colors.Orange)
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
        await interaction.editReply({ embeds: [embed] })
        
        embed.setTitle('NANI!!!!!!!').setURL(gif2).setImage(gif2).setColor(Colors.Red)

        await interaction.followUp({ embeds: [embed] })
    }
}