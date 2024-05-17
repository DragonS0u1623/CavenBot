const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ChannelType } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/statics')
const prisma = require('../../utils/prisma')

module.exports = {
    data: new SlashCommandBuilder().setName('warn').setDescription('Warns the user with the given reason')
        .addUserOption(option => option.setName('target').setDescription('The person you want to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason you are warning this user').setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers | PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        await interaction.deferReply()

        const guild = interaction.guild
        const { user } = interaction
        const member = await guild.members.fetch(user.id)

        if (!member.permissions.has(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers | PermissionFlagsBits.ModerateMembers))
            return interaction.editReply(`You don't have permission to use this command`)

        const admin = await prisma.admins.findUnique({ where: { guildId: guild.id } })
        guild.channels.fetch(admin.audits).then(async channel => {
            if (!channel || channel.type !== ChannelType.GuildText)
                return interaction.editReply(`Please make sure that you have an audit log channel set up`)

            let target, reason = interaction.options.getString('reason') || 'No reason provided'
            const { id } = interaction.options.getUser('target', true)

            target = await guild.members.fetch(id)

            const embed = new EmbedBuilder()
                .setTitle(`${target} Warned`)
                .setDescription(reason)
                .setThumbnail(target.avatarURL())
                .setTimestamp(new Date())
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })
            target.createDM().then(dm => dm.send(`You have been warned in ${guild}\nReason: ${reason}`))
            channel.send({ embeds: [embed] })
        })
    }
}