const Command = require('../../structures/Command.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'leave',
            aliases: ['l'],
            category: 'Music',
            description: 'Makes the bot leave your current voice channel',
            slash: true,
            data: new SlashCommandBuilder().setName('leave').setDescription('Makes the bot leave your current voice channel')
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const { player } = this.client
        if (!player.hasQueue(interaction.guild.id)) return interaction.editReply(`I am not in a voice channel and there is no music playing`)
        let queue = player.getQueue(interaction.guild.id)
        const { member, guild } = interaction
        if (!member.voice) return interaction.editReply(`You must be in a voice channel to use this command`)
        const { channel } = member.voice

        if (guild.me.voice.channel.id !== channel.id) return interaction.editReply(`You need to be in the same voice channel to use this command`)

        queue.stop()
    }

    async run(message, _args) {
        const { player } = this.client
        if (!player.hasQueue(message.guild.id)) return message.channel.send(`I am not in a voice channel and there is no music playing`)
        let queue = player.getQueue(message.guild.id)
        const { member, guild } = message
        if (!member.voice) return message.channel.send(`You must be in a voice channel to use this command`)
        const { channel } = member.voice

        if (guild.me.voice.channel.id !== channel.id) return message.channel.send(`You need to be in the same voice channel to use this command`)

        queue.stop()
    }
}