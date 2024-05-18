import { ChatInputCommandInteraction, GuildMember, InteractionEditReplyOptions, SlashCommandBuilder } from 'discord.js'
import { CavenBot } from '../../types/types.js'

export default {
    data: new SlashCommandBuilder().setName('skip').setDescription('Skips the currently playing song').setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        
        const client = interaction.client as CavenBot
        const guildId = interaction.guildId as string

        const player = client.lavalink.getPlayer(guildId)

        if (!player) return interaction.editReply({ content: 'I am not connected to a voice channel.', ephemeral: true } as InteractionEditReplyOptions)

        if (player.voiceChannelId !== (interaction.member as GuildMember).voice.channelId)
            return interaction.editReply({ content: 'You are not in the same voice channel as me.', ephemeral: true } as InteractionEditReplyOptions)

        if (!player.queue.current) return interaction.editReply({ content: 'There is nothing playing.', ephemeral: true } as InteractionEditReplyOptions)

        player.skip()

        await interaction.editReply('Skipped the current song')
    }
}