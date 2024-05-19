const { SlashCommandBuilder } = require('discord.js')
const prisma = require('../../utils/prisma')

module.exports = {
    data: new SlashCommandBuilder().setName('join').setDescription('Joins the voice channel').setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true })

        const { voice } = interaction.member
        const guildId = interaction.guildId

        if (!voice.channel)
            return interaction.editReply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true })

        if (!voice.channel.joinable || !voice.channel.speakable)
            return interaction.editReply({ content: 'I cannot join your voice channel!', ephemeral: true })

        const volume = await prisma.musicsettings.findUnique({
            where: { guildId: guildId }
        }).then(data => data?.defaultVolume) || interaction.client.defaultVolume

        let player = interaction.client.lavalink.getPlayer(guildId) || interaction.client.lavalink.createPlayer({
            guildId: guildId,
            voiceChannelId: voice.channelId,
            textChannelId: interaction.channelId,
            selfDeaf: false,
            selfMute: false,
            volume: volume
        })

        if (player.voiceChannelId && player.connected)
            return interaction.editReply({ content: 'I am already connected to your voice channel!', ephemeral: true })

        if (player.voiceChannelId !== voice.channelId)
            player.voiceChannelId = voice.channelId

        await player.connect()
        await interaction.editReply(`Joined the voice channel ${voice.channel.name}!`)
    }
}