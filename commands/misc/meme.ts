import { Colors, EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import axios from 'axios'
import { FOOTER, OWNERPFP } from '../../utils/statics'

const url = 'https://meme-api.herokuapp.com/gimme'

export default {
    data: new SlashCommandBuilder().setName('meme').setDescription('Sends a random meme'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()

        axios.get(url).then(async response => {
            const json = response.data

            const embed = new EmbedBuilder()
                .setTitle(json.title)
                .setDescription(`Meme for ${interaction.user} from subreddit [r/${json.subreddit}](https://www.reddit.com/r/${json.subreddit})`)
                .setURL(json.postLink)
                .setImage(json.url)
                .setColor(Colors.Yellow)
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            await interaction.editReply({ embeds: [embed] })
        }).catch(async error => await interaction.editReply('An unexpected error has occurred. Please try again.'))
    }
}