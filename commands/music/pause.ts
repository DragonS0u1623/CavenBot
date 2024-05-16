import { SlashCommandBuilder, ChatInputCommandInteraction, InteractionEditReplyOptions } from 'discord.js'
import { CavenBot } from '../../types/types'

export default {
    data: new SlashCommandBuilder().setName('pause').setDescription('Pauses the current song').setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()

        const client = interaction.client as CavenBot
        const guildId = interaction.guildId as string

        const player = client.lavalink.getPlayer(guildId)
        if (!player || !player.connected)
            return interaction.editReply({ content: 'I am not connected to a voice channel', ephemeral: true } as InteractionEditReplyOptions)

        if (player.paused)
            return interaction.editReply('The player is already paused')

        await player.pause()
        await interaction.editReply(`Paused song ${player.queue.current}`)
    }
}