import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from 'discord.js'
import { CavenBot } from '../../types/types.js'

export default {
    data: new SlashCommandBuilder().setName('volume').setDescription('Change the volume of the music player')
        .addIntegerOption(option => option.setName('volume').setDescription('The volume to set').setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const volume = interaction.options.getInteger('volume', true)

        if (volume < 0 || volume > 100)
            return interaction.reply({ content: 'Volume must be between 0 and 100', ephemeral: true })

        const player = (interaction.client as CavenBot).lavalink.getPlayer(interaction.guildId)

        if (!player || !player.playing)
            return interaction.reply({ content: 'No music is being played on this server', ephemeral: true })

        if (player.voiceChannelId !== (interaction.member as GuildMember).voice.channelId)
            return interaction.reply({ content: 'You must be in the same voice channel to use this command', ephemeral: true })

        player.setVolume(volume)

        return interaction.reply({ content: `Volume set to ${volume}%`, ephemeral: true })
    }
}