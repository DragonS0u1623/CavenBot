const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')
const prisma = require('../../utils/prisma')

module.exports = {
    data: new SlashCommandBuilder().setName('editwelcome').setDescription('Edits the message of the welcome embeds')
        .addStringOption(option => option.setName('message').setDescription('The message you want to appear in your welcome messages').setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        await interaction.deferReply()
        const guild = interaction.guild

        const welcomeMessage = interaction.options.getString('message', true)

        await prisma.admins.update({
            where: {
                guildId: guild.id
            },
            data: {
                welcome_message: welcomeMessage
            }
        })
        await prisma.serversettings.update({
            where: {
                guildId: guild.id
            },
            data: {
                welcome: true
            }
        })
        await interaction.editReply(`Welcome message changed to: "${welcomeMessage}"`)
    }
}