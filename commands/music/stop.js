const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('stop').setDescription('Stops the current song and clears the queue').setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply()
        
        const { voice } = interaction.member
        const client = interaction.client
        const guildId = interaction.guildId

        const player = client.lavalink.getPlayer(guildId)

        if (!player || !player.connected) {
            await interaction.editReply('I am not connected to a voice channel!')
            return
        }

        if (player.voiceChannelId !== voice.channelId) {
            await interaction.editReply('You must be in the same voice channel to use this command')
            return
        }

        await player.stopPlaying(false, false)
        await interaction.editReply('Stopped the current song and cleared the queue')
        player.destroy('Stopped by user', true)
    }
}