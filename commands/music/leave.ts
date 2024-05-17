import { ChatInputCommandInteraction, GuildMember, InteractionEditReplyOptions, SlashCommandBuilder } from 'discord.js'
import { CavenBot } from '../../types/types.js'

export default {
    data: new SlashCommandBuilder().setName('leave').setDescription('Leaves the voice channel').setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        
        const { voice } = (interaction.member as GuildMember)
        const client = interaction.client as CavenBot
        const guildId = interaction.guildId as string

        const player = client.lavalink.getPlayer(guildId)

        if (!player || !player.connected)
            return interaction.editReply({ content: 'I am not connected to a voice channel!', ephemeral: true } as InteractionEditReplyOptions)

        if (player.voiceChannelId !== voice.channelId)
            return interaction.editReply({ content: 'You must be in the same voice channel to use this command', ephemeral: true } as InteractionEditReplyOptions)

        await player.disconnect()
        await interaction.editReply({ content: 'Disconnected from the voice channel', ephemeral: true } as InteractionEditReplyOptions)
    }
}