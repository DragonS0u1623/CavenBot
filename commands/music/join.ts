import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, VoiceChannel } from 'discord.js'
import { CavenBot } from '../../types/types'

export default {
    data: new SlashCommandBuilder().setName('join').setDescription('Joins the voice channel').setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: true })

        const { voice } = (interaction.member as GuildMember)
        const client = interaction.client as CavenBot
        const guildId = interaction.guildId as string

        if (!voice.channel) {
            await interaction.editReply('You need to be in a voice channel to use this command!')
            return
        }

        if (!voice.channel.joinable || !(voice.channel as VoiceChannel).speakable) {
            await interaction.editReply('I cannot join your voice channel!')
            return
        }

        let player = client.lavalink.getPlayer(guildId) || client.lavalink.createPlayer({
            guildId: guildId,
            voiceChannelId: voice.channelId as string,
            textChannelId: interaction.channelId as string,
            selfDeaf: false,
            selfMute: false,
            volume: client.defaultVolume
        })

        if (player.voiceChannelId && player.connected) {
            await interaction.editReply('I am already connected to your voice channel!')
            return
        }

        if (player.voiceChannelId !== voice.channelId) {
            player.voiceChannelId = voice.channelId as string
        }

        await player.connect()
        await interaction.editReply(`Joined the voice channel ${voice.channel.name}!`)
    }
}