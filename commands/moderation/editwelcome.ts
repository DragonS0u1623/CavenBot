import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, Guild } from 'discord.js'
import prisma from '../../utils/prisma'

export default {
    data: new SlashCommandBuilder().setName('editwelcome').setDescription('Edits the message of the welcome embeds')
        .addStringOption(option => option.setName('message').setDescription('The message you want to appear in your welcome messages').setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        const guild = interaction.guild as Guild

        const welcomeMessage = interaction.options.getString('message') as string

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