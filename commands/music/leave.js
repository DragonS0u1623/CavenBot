const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('leave').setDescription('Leaves the voice channel').setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply()
        
        const { voice } = interaction.member
        const client = interaction.client
        const guildId = interaction.guildId

        const player = client.lavalink.getPlayer(guildId)

        if (!player || !player.connected)
            return interaction.editReply({ content: 'I am not connected to a voice channel!', ephemeral: true })

        if (player.voiceChannelId !== voice.channelId)
            return interaction.editReply({ content: 'You must be in the same voice channel to use this command', ephemeral: true })

        await player.disconnect()
        await interaction.editReply({ content: 'Disconnected from the voice channel', ephemeral: true })
    }
}