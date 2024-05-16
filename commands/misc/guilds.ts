import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export default {
    data: new SlashCommandBuilder().setName('guilds').setDescription('Gives the number of servers the bot is in'),
    async execute(interaction: ChatInputCommandInteraction) {
        const guilds = interaction.client.guilds.cache.size
        await interaction.reply(`I'm in ${guilds} servers currently`)
    }
}