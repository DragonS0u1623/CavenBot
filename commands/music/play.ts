import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export default {
    data: new SlashCommandBuilder().setName('play').setDescription('Plays a song with the given search term or URL')
        .addStringOption(option => option.setName('search').setDescription('The search term or URL of the song to play').setRequired(true))
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        let search = interaction.options.getString('search') as string

        
    }
}