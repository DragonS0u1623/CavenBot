const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('ban').setDescription('Bans a user from the server').setDMPermission(false)
        .addUserOption(option => option.setName('user').setDescription('The user to ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the ban').setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        await interaction.deferReply()

        const user = interaction.options.getUser('user', true)
        const reason = interaction.options.getString('reason') || 'No reason provided'

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers))
            return interaction.editReply({ content: 'You do not have permission to ban members', ephemeral: true })

        if (!interaction.appPermissions?.has(PermissionFlagsBits.BanMembers))
            return interaction.editReply({ content: 'I do not have permission to ban members', ephemeral: true })

        const guild = interaction.guild

        await guild.members.ban(user, { reason })
        await interaction.editReply(`Banned ${user.tag} for ${reason}`)
    }
}