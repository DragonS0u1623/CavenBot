const Command = require('../../structures/Command.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { RepeatMode } = require('discord-music-player')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'repeat',
            category: 'Music',
            description: 'Sets the repeat for the song or queue',
            expectedArgs: '[NONE|SONG|QUEUE]',
            slash: true,
            data: new SlashCommandBuilder().setName('repeat').setDescription('Sets the repeat for the song or queue')
                .addStringOption(option => option.setName('repeattype')
                    .setDescription('The option for the repeat mode. Either no repeat, song repeat, or queue repeat')
                    .addChoice('NONE', 'NONE').addChoice('SONG', 'SONG')
                    .addChoice('QUEUE', 'QUEUE').setRequired(true))
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const repeat = interaction.options.getString('repeattype')
        const { player } = this.client
        if (!player.hasQueue(interaction.guild.id)) return interaction.editReply(`I am not in a voice channel`)
        let queue = player.getQueue(interaction.guild.id)
        const { member, guild } = interaction
        if (!member.voice) return interaction.editReply(`You must be in a voice channel to use this command`)
        const { channel } = member.voice

        if (guild.me.voice.channel.id !== channel.id) return interaction.editReply(`You must be in the same voice channel to use this command`)

        switch (repeat) {
            case 'NONE':
                queue.setRepeatMode(RepeatMode.DISABLED)
                interaction.editReply('Repeat disabled')
                break
            case 'SONG':
                queue.setRepeatMode(RepeatMode.SONG)
                interaction.editReply('Repeat set to Song')
                break
            case 'QUEUE':
                queue.setRepeatMode(RepeatMode.QUEUE)
                interaction.editReply('Repeat set to Queue')
                break
            default:
                break
        }
    }

    async run(message, args) {
        const { player } = this.client
        if (!player.hasQueue(message.guild.id)) return message.channel.send(`I am not in a voice channel`)
        let queue = player.getQueue(message.guild.id)
        const { member, guild } = message
        if (!member.voice) return message.channel.send(`You must be in a voice channel to use this command`)
        const { channel } = member.voice

        if (guild.me.voice.channel.id !== channel.id) return message.channel.send(`You must be in the same voice channel to use this command`)

        switch (args[0].toUpperCase()) {
            case 'NONE':
                queue.setRepeatMode(RepeatMode.DISABLED)
                message.channel.send('Repeat disabled')
                break
            case 'SONG':
                queue.setRepeatMode(RepeatMode.SONG)
                message.channel.send('Repeat set to Song')
                break
            case 'QUEUE':
                queue.setRepeatMode(RepeatMode.QUEUE)
                message.channel.send('Repeat set to Queue')
                break
            default:
                message.channel.send('Please use the command with either `NONE`, `SONG`, or `QUEUE`')
                break
        }
    }
}