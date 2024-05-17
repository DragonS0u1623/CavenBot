import { ChatInputCommandInteraction, GuildMember, InteractionEditReplyOptions, SlashCommandBuilder, VoiceChannel } from 'discord.js'
import { CavenBot } from '../../types/types.js'
import { SearchPlatform, SearchResult, UnresolvedSearchResult } from 'lavalink-client/dist/types'

export default {
    data: new SlashCommandBuilder().setName('play').setDescription('Plays a song with the given search term or URL')
        .addStringOption(option => option.setName('search').setDescription('The search term or URL of the song to play. If you use a link').setRequired(true))
        .addStringOption(option => option.setName('source').setDescription('The source to use for searches').setRequired(false).setChoices(
            { name: 'YouTube', value: 'ytsearch' },
            { name: 'YouTube Music', value: 'ytmsearch' },
            { name: 'Soundcloud', value: 'scsearch' },
            { name: 'Spotify', value: 'spsearch'}
        ))
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()

        const client = interaction.client as CavenBot
        const { voice } = (interaction.member as GuildMember)

        if (!voice.channel)
            return interaction.editReply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true } as InteractionEditReplyOptions)

        if (!voice.channel.joinable || !(voice.channel as VoiceChannel).speakable)
            return interaction.editReply({ content: 'I cannot join your voice channel!', ephemeral: true } as InteractionEditReplyOptions)

        let search = interaction.options.getString('search', true)
        const source = interaction.options.getString('source')

        const player = client.lavalink.getPlayer(interaction.guildId as string) || client.lavalink.createPlayer({
            guildId: interaction.guildId as string,
            voiceChannelId: voice.channelId as string,
            textChannelId: interaction.channelId as string,
            selfDeaf: false,
            selfMute: false,
            volume: client.defaultVolume
        })

        if (!player.connected)
            await player.connect()

        if (player.voiceChannelId !== voice.channelId)
            return interaction.editReply({ content: 'You must be in the same channel as me to use this command', ephemeral: true } as InteractionEditReplyOptions)
        
        let result: SearchResult | UnresolvedSearchResult
        if (!source) {
            result = await player.search({
                query: search
            }, interaction.user)
        }
        else {
            result = await player.search({
                query: search,
                source: source as SearchPlatform
            }, interaction.user)
        }

        if (!result || !result.tracks?.length)
            return interaction.editReply({ content: 'No results found!', ephemeral: true } as InteractionEditReplyOptions)

        await player.queue.add(result.loadType === 'playlist' ? result.tracks : result.tracks[0])

        await interaction.editReply(`Added ${ result.loadType === 'playlist' ? result.playlist?.title : result.tracks[0].info.title } to the queue.`)

        if (!player.playing) await player.play()
    }
}