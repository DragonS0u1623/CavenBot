import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, Colors } from 'discord.js'
import axios from 'axios'
import { FOOTER, OWNERPFP } from '../../utils/statics.js'

export default {
    data: new SlashCommandBuilder().setName('beg')
		.setDescription('Sends an embed with a gif of the given search term')
        .addStringOption(option => option.setName('searchTerm').setDescription('The term you want to search').setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()

        const searchTerm = interaction.options.getString('searchTerm', true)
        searchTerm.replace(' ', '%20')
        const TenorAPI = `https://api.tenor.com/v1/random?q=${searchTerm}&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`

        axios.get(TenorAPI).then(async response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.displayName} gives a gif to everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            await interaction.editReply({ embeds: [embed] })
        }).catch(async error => await interaction.editReply('An error has occurred. Please try again.'))
    }
}