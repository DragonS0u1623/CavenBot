import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } from 'discord.js'
import axios from 'axios'
import { FOOTER, OWNERPFP } from '../../utils/statics'

const TenorAPI = `https://api.tenor.com/v1/random?q=anime%20cuddle&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`

export default {
    data: new SlashCommandBuilder().setName('cuddle')
		.setDescription('Sends an embed with a gif of someone being cuddled')
        .addUserOption(option => option.setName('target').setDescription('The person you want to cuddle').setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()

        axios.get(TenorAPI).then(async response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user} cuddles everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            const user = interaction.options.getUser('target')
            if (user != null) embed.setTitle(`${interaction.user} cuddles ${user}`)
            await interaction.editReply({ embeds: [embed] })
        }).catch(async error => await interaction.editReply('An error has occurred. Please try again.'))
    }
}