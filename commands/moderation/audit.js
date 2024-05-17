const { ChannelType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')
const prisma = require('../../utils/prisma')

module.exports = {
    data: new SlashCommandBuilder().setName('audit').setDescription('Sets the channel to send audit log data').setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addChannelOption(option => option.setName('channel').setDescription('The channel to send audit log data').setRequired(true).addChannelTypes(ChannelType.GuildText)),
    async execute(interaction) {
        await interaction.deferReply()

        const channel = interaction.options.getChannel<ChannelType.GuildText>('channel')
        if (!channel)
            return interaction.editReply({ content: 'Invalid channel', ephemeral: true })

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