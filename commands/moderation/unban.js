const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('unban').setDescription('Unbans the user from the server. Uses the user ID')
        .addUserOption(option => option.setName('target').setDescription('The user you want to unban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the unban').setRequired(false))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        interaction.deferReply()
        const guild = interaction.guild

        if (!guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers))
            return interaction.editReply({ content: `I don't have permission to do that\n\n**Needed Perms**\nBan Members`, ephemeral: true })

        let target = interaction.options.getUser('target', true), reason = interaction.options.getString('reason') || 'No reason provided'
        guild.bans.fetch(target).then((ban) => {
            guild.bans.remove(target, reason).then(async () => await interaction.editReply(`Member unbanned`))
        }).catch(async () => await interaction.editReply({ content: `Please make sure that you gave the correct User ID`, ephemeral: true }))
    }
}