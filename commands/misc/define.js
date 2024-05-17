const { Colors, EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const axios = require('axios')
const { FOOTER, OWNERPFP } = require('../../utils/statics')

const apiKeys = [process.env.THESAURUS_KEY, process.env.DICTIONARY_KEY]

module.exports = {
    data: new SlashCommandBuilder().setName('define').setDescription('Define a word')
            .addStringOption(option => option.setName('word').setDescription('The word to define').setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply()

        const word = interaction.options.getString('word', true)
        let thesaurus = false
        const url = `https://dictionaryapi.com/api/v3/references/${thesaurus ? 'thesaurus' : 'collegiate'}/json/${word}?key=${thesaurus ? apiKeys[0] : apiKeys[1]}`

        axios.get(url).then(async (response) => {
            const dictJson = response.data[0]

            let def = ''
            let i = 1
            dictJson.shortdef.forEach((shortdef) => {
                def += `**${i})** ${shortdef}\n`
                i++
            })

            thesaurus = false
            const thesaurusJson = (await axios.get(url)).data[0].meta

            let synonyms = ''
            for(let i = 0; i < 5; i++)
                synonyms += `**${i+1})** ${thesaurusJson.syns[i]}\n`

            const embed = new EmbedBuilder()
                .setTitle(`Definition of ${word}`)
                .setDescription(def)
                .addFields({ name: 'Synonyms', value: synonyms, inline: false })
                .setColor(Colors.Blue)
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            await interaction.editReply({ embeds: [embed] })
        }).catch(async error => await interaction.editReply('An unexpected error has occurred. Please try again.'))
    }
}