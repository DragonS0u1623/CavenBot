const { SlashCommandBuilder } = require('discord.js')
const prisma = require('../../utils/prisma')

module.exports = {
    data: new SlashCommandBuilder().setName('play').setDescription('Plays a song with the given search term or URL')
        .addStringOption(option => option.setName('search').setDescription('The search term or URL of the song to play. If you use a link').setRequired(true))
        .addStringOption(option => option.setName('source').setDescription('The source to use for searches').setRequired(false).setChoices(
            { name: 'YouTube', value: 'ytsearch' },
            { name: 'YouTube Music', value: 'ytmsearch' },
            { name: 'Soundcloud', value: 'scsearch' },
            { name: 'Spotify', value: 'spsearch'}
        ))
        .setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply()

        const { voice } = interaction.member

        if (!voice.channel)
            return interaction.editReply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true })

        if (!voice.channel.joinable || !(voice.channel).speakable)
            return interaction.editReply({ content: 'I cannot join your voice channel!', ephemeral: true })

        let search = interaction.options.getString('search', true)
        const source = interaction.options.getString('source')

        const volume = await prisma.musicsettings.findUnique({
            where: { guildId: interaction.guildId }
        }).then(data => data?.defaultVolume) || interaction.client.defaultVolume

        const player = interaction.client.lavalink.getPlayer(interaction.guildId) || interaction.client.lavalink.createPlayer({
            guildId: interaction.guildId,
            voiceChannelId: voice.channelId,
            textChannelId: interaction.channelId,
            selfDeaf: false,
            selfMute: false,
            volume: volume
        })

        if (!player.connected)
            await player.connect()

        if (player.voiceChannelId !== voice.channelId)
            return interaction.editReply({ content: 'You must be in the same channel as me to use this command', ephemeral: true })
        
        let result
        if (!source) {
            result = await player.search({
                query: search
            }, interaction.user)
        }
        else {
            result = await player.search({
                query: search,
                source: source
            }, interaction.user)
        }

        if (!result || !result.tracks?.length)
            return interaction.editReply({ content: 'No results found!', ephemeral: true })

        await player.queue.add(result.loadType === 'playlist' ? result.tracks : result.tracks[0])

        await interaction.editReply(`Added ${ result.loadType === 'playlist' ? result.playlist?.title : result.tracks[0].info.title } to the queue.`)

        if (!player.playing) await player.play()
    }
}