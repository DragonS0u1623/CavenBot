const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('guilds').setDescription('Gives the number of servers the bot is in'),
    async execute(interaction) {
        const guilds = await interaction.client.shard.fetchClientValues('guilds.cache.size')
        await interaction.reply(`I'm in ${guilds.reduce((acc, guildCount) => acc + guildCount, 0)} servers currently`)
    }
}