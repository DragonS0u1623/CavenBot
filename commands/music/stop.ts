import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js'
import { CavenBot } from '../../types/types.js'

export default {
    data: new SlashCommandBuilder().setName('stop').setDescription('Stops the current song and clears the queue').setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        
        const { voice } = (interaction.member as GuildMember)
        const client = interaction.client as CavenBot
        const guildId = interaction.guildId as string

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