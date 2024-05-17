const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')
const prisma = require('../../utils/prisma')

module.exports = {
    data: new SlashCommandBuilder().setName('settings')
        .setDescription('Command to toggle on and off different settings for the bot')
        .addStringOption(option => option.setName('option').setDescription('Enable or disable Audits or Welcome Messages or both')
            .setChoices(
                {name: 'AUDITS', value: 'AUDITS'}, 
                {name: 'WELCOME', value: 'WELCOME'},
                {name: 'BOTH', value: 'BOTH'}
            ).setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        const guild = interaction.guild

        const { welcome, audits } = await prisma.serversettings.findUnique({ guildId: guild.id })
        switch(interaction.options.getString('option')) {
            case 'AUDITS':
                await prisma.serversettings.update({ 
                    where: { guildId: guild.id },
                    data: { audits: !audits }
                })
                await interaction.editReply(`Audit messages have been ${!audits ? 'enabled' : 'disabled' }`)
                break
            case 'WELCOME':
                await prisma.serversettings.update({ 
                    where: { guildId: guild.id }, 
                    data: { welcome: !welcome }
                })
                await interaction.editReply(`Welcome messages have been ${!welcome ? 'enabled' : 'disabled' }`)
                break
            case 'BOTH':
                await prisma.serversettings.update({ 
                    where: { guildId: guild.id }, 
                    data: { audits: !audits, welcome: !welcome }
                })
                await interaction.editReply(`Audit messages have been ${!audits ? 'enabled' : 'disabled' }\nWelcome messages have been ${!welcome ? 'enabled' : 'disabled' }`)
                break
            default:
                await interaction.editReply(`You need to choose a correct argument for this command`)
                break
        }
    }
}