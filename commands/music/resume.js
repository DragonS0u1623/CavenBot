const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('resume').setDescription('Resumes the current song').setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply()

        const client = interaction.client
        const guildId = interaction.guildId

        const player = client.lavalink.getPlayer(guildId)
        if (!player || !player.connected)
            return interaction.editReply({ content: 'I am not connected to a voice channel', ephemeral: true })

        if (!player.paused)
            return interaction.editReply('The player is not paused')

        await player.resume()
        await interaction.editReply(`Resumed song ${player.queue.current}`)
    }
}