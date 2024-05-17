const { EmbedBuilder, Colors, SlashCommandBuilder } = require('discord.js')
const axios = require('axios')
const { FOOTER, OWNERPFP } = require('../../utils/statics')

const TenorAPI = `https://api.tenor.com/v1/random?q=anime%20sass&key=${process.env.TENORGIF_KEY}&limit=1&media_filter=minimal`

module.exports = {
	data: new SlashCommandBuilder().setName('sass')
		.setDescription('Sends an embed with a gif of someone being sassy')
        .addUserOption(option => option.setName('target').setDescription('The person you want to sass').setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply()

        axios.get(TenorAPI).then(async response => {
            const json = response.data.results[0].media[0].gif

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.displayName} sasses everyone`)
                .setDescription(`[Link to image](${json.url})`)
                .setImage(json.url)
                .setColor(Colors.NotQuiteBlack)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            const user = interaction.options.getUser('target')
            if (user != null) embed.setTitle(`${interaction.user.displayName} sasses ${user.displayName}`)
            await interaction.editReply({ embeds: [embed] })
        }).catch(async error => await interaction.editReply('An error has occurred. Please try again.'))
    }
}