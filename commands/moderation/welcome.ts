import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder, Guild, ChannelType } from 'discord.js'
import prisma from '../../utils/prisma'

export default {
    data: new SlashCommandBuilder().setName('welcome').setDescription('Sets the channel to send welcome messages')
        .addChannelOption(option => option.setName('channel').setDescription('The channel you want to send welcome messages to').setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        const guild = interaction.guild as Guild

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