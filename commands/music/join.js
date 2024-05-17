const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('join').setDescription('Joins the voice channel').setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        const { voice } = interaction.member
        const client = interaction.client
        const guildId = interaction.guildId

        if (!voice.channel)
            return interaction.editReply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true })

        if (!voice.channel.joinable || !voice.channel.speakable)
            return interaction.editReply({ content: 'I cannot join your voice channel!', ephemeral: true })

        let player = client.lavalink.getPlayer(guildId) || client.lavalink.createPlayer({
            guildId: guildId,
            voiceChannelId: voice.channelId,
            textChannelId: interaction.channelId,
            selfDeaf: false,
            selfMute: false,
            volume: client.defaultVolume
        })

        if (player.voiceChannelId && player.connected)
            return interaction.editReply({ content: 'I am already connected to your voice channel!', ephemeral: true })

        if (player.voiceChannelId !== voice.channelId)
            player.voiceChannelId = voice.channelId

        await player.connect()
        await interaction.editReply(`Joined the voice channel ${voice.channel.name}!`)
    }
}