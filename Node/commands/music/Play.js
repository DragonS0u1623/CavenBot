const Command = require('../../structures/Command.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'play',
            aliases: ['p'],
            category: 'Music',
            description: 'Plays the given song or adds it to the queue if the player is already playing a song',
            expectedArgs: '[url]',
            slash: true,
            data: new SlashCommandBuilder().setName('play')
                .setDescription('Plays the given song or adds it to the queue if the player is already playing a song')
                .addStringOption(option => option.setName('url').setDescription('The url or search term to play').setRequired(true))
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const url = interaction.options.getString('url')
        const { player } = this.client
        let queue = player.hasQueue(interaction.guild.id) ? player.getQueue(interaction.guild.id) : player.createQueue(interaction.guild.id, {
            data: {
                message: message
            }
        })
        const { member } = interaction
        if (!member.voice) return interaction.editReply(`You need to be in a voice channel to use this command`)
        const { channel } = member.voice

        await queue.join(channel)

        await queue.play(url, { requestedBy: message.author }).catch(err => {
            if (!queue) queue.stop()
        })
    }

    async run(message, args) {
        const { player } = this.client
        let queue = player.hasQueue(message.guild.id) ? player.getQueue(message.guild.id) : player.createQueue(message.guild.id, {
            data: {
                message: message
            }
        })
        const { member } = message
        if (!member.voice) return message.channel.send(`You need to be in a voice channel to use this command`)
        const { channel } = member.voice

        await queue.join(channel)

        await queue.play(args.join(' '), { requestedBy: message.author }).catch(error => {
            if (!queue) queue.stop()
        })
    }
}