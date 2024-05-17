import { ChatInputCommandInteraction, PermissionFlagsBits, Colors, EmbedBuilder, SlashCommandBuilder, Guild, ChannelType, InteractionEditReplyOptions } from 'discord.js'
import prisma from '../../utils/prisma.js'
import { FOOTER, OWNERPFP } from '../../utils/statics.js'

export default {
    data: new SlashCommandBuilder().setName('kick').setDescription('Kicks the user from the server')
        .addUserOption(option => option.setName('target').setDescription('The person you want to kick').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason they are being kicked').setRequired(false))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        
        const guild = interaction.guild as Guild
        const { member } = interaction
        let { id } = interaction.options.getUser('target', true)
        const reason = interaction.options.getString('reason') || 'No reason given'

        const kick = await guild.members.fetch(id)

        if (!guild.members.me?.permissions.has(PermissionFlagsBits.KickMembers))
            return interaction.editReply({ content: `I don't have permission to do that\n\n**Needed Perms**\nKick Members`, ephemeral: true } as InteractionEditReplyOptions)

        if (!kick.kickable)
            return interaction.editReply({ content: 'I can\'t kick that member. They may be have higher roles than me', ephemeral: true } as InteractionEditReplyOptions)
        

        if (member === kick)
            return interaction.editReply({ content: 'You can\'t kick yourself', ephemeral: true } as InteractionEditReplyOptions)

        guild.members.kick(kick, reason).then(async (__) => {
            const admin = await prisma.admins.findUnique({ where: { guildId: guild.id } })
            guild.channels.fetch(admin.audits).then(channel => {
                if (!channel || channel.type !== ChannelType.GuildText)
                    return interaction.editReply({ content: 'Audit channel not found', ephemeral: true } as InteractionEditReplyOptions)

                const embed = new EmbedBuilder()
                    .setTitle(`Member Kicked: ${kick}`)
                    .setThumbnail(kick.avatarURL())
                    .setColor(Colors.Purple)
                    .setTimestamp()
                    .setFooter({ text: FOOTER, iconURL: OWNERPFP })
    
                if (reason) embed.setDescription(reason)
                channel.send({ embeds: [embed] })
            })

            await interaction.editReply('Member kicked')
        })
    }
}