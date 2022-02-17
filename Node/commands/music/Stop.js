const Command = require('../../structures/Command.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'stop',
            aliases: ['s'],
            category: 'Music',
            description: 'Stops the music and clears the queue',
            slash: true,
            data: new SlashCommandBuilder().setName('stop').setDescription('Stops the music and clears the queue')
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const { player } = this.client
        if (!player.hasQueue(interaction.guild.id)) return interaction.editReply(`I am not in a voice channel`)
        let queue = player.getQueue(interaction.guild.id)
        const { member, guild } = interaction
        if (!member.voice) return interaction.editReply(`You must be in a voice channel to use this command`)
        const { channel } = member.voice

        if (guild.me.voice.channel.id !== channel.id) return interaction.editReply(`You must be in the same voice channel to use this command`)

        queue.stop()
        interaction.editReply(`Song stopped and queue cleared`)
    }

    async run(message, _args) {
        const { player } = this.client
        if (!player.hasQueue(message.guild.id)) return message.channel.send(`I am not in a voice channel`)
        let queue = player.getQueue(message.guild.id)
        const { member, guild } = message
        if (!member.voice) return message.channel.send(`You must be in a voice channel to use this command`)
        const { channel } = member.voice

        if (guild.me.voice.channel.id !== channel.id) return message.channel.send(`You must be in the same voice channel to use this command`)

        queue.stop()
        message.channel.send(`Song stopped and queue cleared`)
    }
}