import { ChannelType, ChatInputCommandInteraction, InteractionEditReplyOptions, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'
import prisma from '../../utils/prisma'

export default {
    data: new SlashCommandBuilder().setName('audit').setDescription('Sets the channel to send audit log data').setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option => option.setName('channel').setDescription('The channel to send audit log data').setRequired(true).addChannelTypes(ChannelType.GuildText)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()

        const channel = interaction.options.getChannel<ChannelType.GuildText>('channel')
        if (!channel)
            return interaction.editReply({ content: 'Invalid channel', ephemeral: true } as InteractionEditReplyOptions)

        await prisma.admins.update({
            where: {
                guildId: interaction.guildId
            },
            data: {
                auditChannel: channel.id
            }
        })
        await prisma.serversettings.update({
            where: {
                guildId: interaction.guildId
            },
            data: {
                audits: true
            }
        })

        await interaction.editReply(`Audit channel set to ${channel}`)
    }
}