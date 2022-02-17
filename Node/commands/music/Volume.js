const Command = require('../../structures/Command.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'volume',
            aliases: ['v'],
            category: 'Music',
            description: 'Sets the volume for the music playing',
            slash: true,
            data: new SlashCommandBuilder().setName('volume')
                .setDescription('Sets the volume for the music playing')
                .addIntegerOption(option => option.setName('volume').setDescription('The value to change the volume to').setRequired(true))
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const volume = interaction.options.getInteger('volume')
        const { player } = this.client
        if (!player.hasQueue(interaction.guild.id)) return interaction.editReply(`I am not in a voice channel`)
        let queue = player.getQueue(interaction.guild.id)
        const { member, guild } = interaction
        if (!member.voice) return interaction.editReply(`You must be in a voice channel to use this command`)
        const { channel } = member.voice

        if (guild.me.voice.channel.id !== channel.id) return interaction.editReply(`You must be in the same voice channel to use this command`)

        if (volume > 100) volume = 100
        queue.setVolume(volume)
        interaction.editReply(`Volume set to ${volume}%`)
        
    }

    async run(message, args) {
        const { player } = this.client
        if (!player.hasQueue(message.guild.id)) return message.channel.send(`I am not in a voice channel`)
        let queue = player.getQueue(message.guild.id)
        const { member, guild } = message
        if (!member.voice) return message.channel.send(`You must be in a voice channel to use this command`)
        const { channel } = member.voice

        if (guild.me.voice.channel.id !== channel.id) return message.channel.send(`You must be in the same voice channel to use this command`)

        const volume = parseInt(args[0])
        if (volume > 100) volume = 100
        queue.setVolume(volume)
        message.channel.send(`Volume set to ${volume}%`)
    }
}