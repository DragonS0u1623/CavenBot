const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('skip').setDescription('Skips the currently playing song').setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply()
        
        const guildId = interaction.guildId

        const player = interaction.client.lavalink.getPlayer(guildId)

        if (!player || !player.connected()) return interaction.editReply({ content: 'I am not connected to a voice channel.', ephemeral: true })

        if (player.voiceChannelId !== interaction.member.voice.channelId) return interaction.editReply({ content: 'You are not in the same voice channel as me.', ephemeral: true })

        if (!player.queue.current) return interaction.editReply({ content: 'There is nothing playing.', ephemeral: true })

        player.skip()
        
        await interaction.editReply('Skipped the current song')
    }
}