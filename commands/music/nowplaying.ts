import { ChatInputCommandInteraction, Colors, EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js'
import { CavenBot } from '../../types/types'
import { findEmoji } from '../../utils/utils'
import { FOOTER, NPEMOTE, OWNERPFP } from '../../utils/statics'

export default {
    data: new SlashCommandBuilder().setName('nowplaying').setDescription('Shows the currently playing song').setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        
        const client = interaction.client as CavenBot
        const guildId = interaction.guildId as string

        const player = client.lavalink.getPlayer(guildId)

        if (!player) return interaction.editReply('I am not connected to a voice channel.')

        const track = player.queue.current
        if (!track) return interaction.editReply('There is nothing playing.')

        const npEmote = client.shard?.broadcastEval(findEmoji, { context: { nameOrId: NPEMOTE }})
            .then(emojiArray => {
                return emojiArray.find(emoji => emoji)
            })

        const embed = new EmbedBuilder().setTitle(`${npEmote} Now Playing ${npEmote}`).setDescription(`[${track.info.title}](${track.info.uri})`)
            .setThumbnail(track.info.artworkUrl).setColor(Colors.LuminousVividPink)
            .addFields({ name: 'Author', value: track.info.author, inline: true }, { name: 'Requester', value: `${track.requester}`, inline: true })
            .setFooter({ text: FOOTER, iconURL: OWNERPFP }).setTimestamp()

        await interaction.editReply({ embeds: [embed] })
    }
}