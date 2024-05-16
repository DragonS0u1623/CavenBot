import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, User, GuildBan, Guild } from 'discord.js'

export default {
    data: new SlashCommandBuilder().setName('unban').setDescription('Unbans the user from the server. Uses the user ID')
        .addUserOption(option => option.setName('target').setDescription('The user you want to unban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for the unban').setRequired(false))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction: ChatInputCommandInteraction) {
        interaction.deferReply()
        const guild = interaction.guild as Guild

        if (!guild.members.me?.permissions.has(PermissionFlagsBits.BanMembers))
            return interaction.editReply(`I don't have permission to do that\n\n**Needed Perms**\nBan Members`)

        let target = interaction.options.getUser('target', true), reason = interaction.options.getString('reason') || 'No reason provided'
        guild.bans.fetch(target).then((ban: GuildBan) => {
            guild.bans.remove(target, reason).then(async () => await interaction.editReply(`Member unbanned`))
        }).catch(async () => await interaction.editReply(`Please make sure that you gave the correct User ID`))
    }
}