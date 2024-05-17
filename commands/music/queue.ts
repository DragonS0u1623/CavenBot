import { ChatInputCommandInteraction, Colors, EmbedBuilder, InteractionEditReplyOptions, SlashCommandBuilder } from 'discord.js'
import { CavenBot } from '../../types/types.js'
import { findEmoji } from '../../utils/utils.js'
import { FOOTER, NPEMOTE, OWNERPFP } from '../../utils/statics.js'

export default {
    data: new SlashCommandBuilder().setName('queue').setDescription('Shows the current queue or removes a song from the queue').setDMPermission(false)
        .addSubcommand(subcommand => subcommand.setName('show').setDescription('Shows the current queue'))
        .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Removes a song from the queue')
            .addIntegerOption(option => option.setName('index').setDescription('The index of the song to remove').setRequired(true))),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        
        const client = interaction.client as CavenBot
        const guildId = interaction.guildId as string

        const player = client.lavalink.getPlayer(guildId)
        if (!player || !player.connected) {
            await interaction.editReply({ content: 'I am not connected to a voice channel', ephemeral: true } as InteractionEditReplyOptions)
            return
        }

        const subcommand = interaction.options.getSubcommand()

        switch (subcommand) {
            case 'show': {
                if (player.queue.tracks.length === 0) {
                    await interaction.editReply('The queue is empty')
                    return
                }

                const npEmote = client.shard?.broadcastEval(findEmoji, { context: { nameOrId: NPEMOTE }})
                    .then(emojiArray => {
                        return emojiArray.find(emoji => emoji)
                    })

                const embed = new EmbedBuilder().setTitle(`${npEmote} Queue ${npEmote}`)
                    .setTimestamp()
                    .setFooter({ text: FOOTER, iconURL: OWNERPFP })
                    .setColor(Colors.Blurple)
                
                let i = 1
                for (const track of player.queue.tracks)
                    embed.addFields({ name: `${i++}. ${track.info.title}`, value: `by ${track.info.author} [${track.requester}]`, inline: false })

                await interaction.editReply({ embeds: [embed] })
                break
            }
            case 'remove': {
                const index = interaction.options.getInteger('index') as number
                if (index < 1 || index > player.queue.tracks.length) {
                    await interaction.editReply({ content: 'Invalid index. The index must be a number between 1 and the length of the queue', ephemeral: true } as InteractionEditReplyOptions)
                    return
                }

                for (let i = index-1; i < player.queue.tracks.length - 1; i++) {
                    if (i === player.queue.tracks.length - 1) {
                        player.queue.tracks.pop()
                        break
                    }
                    player.queue.tracks[i] = player.queue.tracks[i + 1]
                }

                await interaction.editReply(`Removed song at index ${index}`)
                break
            }
            case 'default': {
                await interaction.editReply({ content: 'Invalid subcommand', ephemeral: true } as InteractionEditReplyOptions)
                break
            }
        }
    }
}