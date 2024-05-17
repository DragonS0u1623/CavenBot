const { PermissionFlagsBits, SlashCommandBuilder, ChannelType } = require('discord.js')
const prisma = require('../../utils/prisma')

module.exports = {
    data: new SlashCommandBuilder().setName('welcome').setDescription('Sets the channel to send welcome messages')
        .addChannelOption(option => option.setName('channel').setDescription('The channel you want to send welcome messages to').setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        await interaction.deferReply()
        const guild = interaction.guild

        const { id } = interaction.options.getChannel('channel', true)
        guild.channels.fetch(id).then(async channel => {
            if (!channel || channel.type !== ChannelType.GuildText)
                return interaction.editReply(`Please make sure that you gave a valid text channel`)

            await prisma.admins.update({
                where: { guildId: guild.id },
                data: { welcome: channel.id }
            })
            await interaction.editReply(`Welcome messages will be sent to ${channel}`)
        })
    }
}