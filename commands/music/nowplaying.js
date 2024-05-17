const { Colors, EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { findEmoji } = require('../../utils/utils')
const { FOOTER, NPEMOTE, OWNERPFP } = require('../../utils/statics')

module.exports = {
    data: new SlashCommandBuilder().setName('nowplaying').setDescription('Shows the currently playing song').setDMPermission(false),
    async execute(interaction) {
        await interaction.deferReply()
        
        const client = interaction.client
        const guildId = interaction.guildId

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