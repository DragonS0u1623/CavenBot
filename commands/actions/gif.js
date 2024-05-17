const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js')
const axios = require('axios')
const { FOOTER, OWNERPFP } = require('../../utils/statics')

module.exports = {
    data: new SlashCommandBuilder().setName('beg')
		.setDescription('Sends an embed with a gif of the given search term')
        .addStringOption(option => option.setName('searchterm').setDescription('The term you want to search').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()

        const searchTerm = interaction.options.getString('searchterm', true)

        const TenorAPI = `https://api.tenor.com/v1/random?q=${encodeURI(searchTerm)}&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`

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
        }).catch(async error => await interaction.editReply({ content: 'An error has occurred. Please try again.', ephemeral: true }))
    }
}