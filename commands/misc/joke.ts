import axios from 'axios'
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

const url = 'https://sv443.net/jokeapi/v2/joke/Any'

export default {
    data: new SlashCommandBuilder().setName('joke').setDescription('Sends a random joke to the chat'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()

        axios.get(url).then(async response => {
            const json = response.data

            let joke = ''
            if (json.type === 'single')
                joke = json.joke
            else if (json.type === 'twopart')
                joke = `${json.setup}\n${json.delivery}`
            await interaction.editReply(joke)
        }).catch(async error => await interaction.editReply('An unexpected error has occurred. Please try again.'))
    }
}