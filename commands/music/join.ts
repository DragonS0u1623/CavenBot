import { ChatInputCommandInteraction, GuildMember, InteractionEditReplyOptions, SlashCommandBuilder, VoiceChannel } from 'discord.js'
import { CavenBot } from '../../types/types.js'
import prisma from '../../utils/prisma.js'

export default {
    data: new SlashCommandBuilder().setName('join').setDescription('Joins the voice channel').setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true })

        const { voice } = (interaction.member as GuildMember)
        const client = interaction.client as CavenBot
        const guildId = interaction.guildId as string

        if (!voice.channel)
            return interaction.editReply({ content: 'You need to be in a voice channel to use this command!', ephemeral: true } as InteractionEditReplyOptions)

        if (!voice.channel.joinable || !(voice.channel as VoiceChannel).speakable)
            return interaction.editReply({ content: 'I cannot join your voice channel!', ephemeral: true } as InteractionEditReplyOptions)

        const volume = await prisma.musicsettings.findUnique({
            where: { guildId: guildId }
        }).then(data => data?.defaultVolume) || client.defaultVolume

        let player = client.lavalink.getPlayer(guildId) || client.lavalink.createPlayer({
            guildId: guildId,
            voiceChannelId: voice.channelId as string,
            textChannelId: interaction.channelId as string,
            selfDeaf: false,
            selfMute: false,
            volume: volume
        })

        if (player.voiceChannelId && player.connected)
            return interaction.editReply({ content: 'I am already connected to your voice channel!', ephemeral: true } as InteractionEditReplyOptions)

        if (player.voiceChannelId !== voice.channelId)
            player.voiceChannelId = voice.channelId as string

        await player.connect()
        await interaction.editReply(`Joined the voice channel ${voice.channel.name}!`)
    }
}