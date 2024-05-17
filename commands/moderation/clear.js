const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js')

module.exports =  {
    data: new SlashCommandBuilder().setName('clear').setDescription('Clears the specified amount of messages from the channel. Default is 5')
        .addIntegerOption(option => option.setName('amount').setDescription('The amount to clear').setRequired(false))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        await interaction.deferReply()
        const guild = interaction.guild
        
        if (!guild.members.me?.permissions.has(PermissionFlagsBits.ManageMessages))
            return interaction.editReply({ content: `I don't have permission to do that\n\n**Needed Perms**\nManage Messages`, ephemeral: true })

        let limit = interaction.options.getInteger('amount') || 5

        const filter = (m) => !m.pinned
        interaction.channel?.awaitMessages({ filter, max: limit }).then(messages => messages.forEach(message => message.delete()))
    }
}