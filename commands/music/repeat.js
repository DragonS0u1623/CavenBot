const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder().setName('repeat').setDescription('Repeats the current song').setDMPermission(false)
        .addStringOption(option => option.setName('mode').setDescription('The repeat mode')
            .setRequired(true).addChoices({ name: 'OFF', value: 'off' }, { name: 'SONG', value: 'track' }, { name: 'QUEUE', value: 'queue' })),
    async execute(interaction) {
        await interaction.deferReply()
        let mode = interaction.options.getString('mode')

        const client = interaction.client
        const guildId = interaction.guildId

        const player = client.lavalink.getPlayer(guildId)
        if (!player || !player.connected)
            return interaction.editReply({ content: 'I am not connected to a voice channel', ephemeral: true })

        await player.setRepeatMode(mode)

        await interaction.editReply(`Set repeat mode to ${mode}`)
    }
}