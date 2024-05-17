const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('pause').setDescription('Pauses the current song').setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply()

        const client = interaction.client
        const guildId = interaction.guildId

        const player = client.lavalink.getPlayer(guildId)
        if (!player || !player.connected)
            return interaction.editReply({ content: 'I am not connected to a voice channel', ephemeral: true })

        if (player.paused)
            return interaction.editReply('The player is already paused')

        await player.pause()
        await interaction.editReply(`Paused song ${player.queue.current}`)
    }
}