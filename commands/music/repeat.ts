import { ChatInputCommandInteraction, InteractionEditReplyOptions, SlashCommandBuilder } from 'discord.js'
import { CavenBot } from '../../types/types'
import { RepeatMode } from 'lavalink-client/dist/types'

export default {
    data: new SlashCommandBuilder().setName('repeat').setDescription('Repeats the current song').setDMPermission(false)
        .addStringOption(option => option.setName('mode').setDescription('The repeat mode')
            .setRequired(true).addChoices({ name: 'OFF', value: 'off' }, { name: 'SONG', value: 'track' }, { name: 'QUEUE', value: 'queue' })),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        let mode = interaction.options.getString('mode') as string

        const client = interaction.client as CavenBot
        const guildId = interaction.guildId as string

        const player = client.lavalink.getPlayer(guildId)
        if (!player || !player.connected)
            return interaction.editReply({ content: 'I am not connected to a voice channel', ephemeral: true } as InteractionEditReplyOptions)

        await player.setRepeatMode(mode as RepeatMode)

        await interaction.editReply(`Set repeat mode to ${mode}`)
    }
}