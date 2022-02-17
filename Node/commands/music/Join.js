const Command = require('../../structures/Command.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'join',
            aliases: ['j'],
            category: 'Music',
            description: 'Makes the bot join your current voice channel',
            slash: true,
            data: new SlashCommandBuilder().setName('join').setDescription('Makes the bot join your current voice channel')
        })
    }

    async executeSlash(interaction) {
        const { player } = this.client
        const { member, guild } = interaction
        if (!member.voice) return interaction.reply(`You must be in a voice channel to use this command`)
        const { channel } = member.voice
        
        let queue = player.createQueue(guild.id, {
            data: {
                message: message
            }
        })
        queue.join(channel)
    }

    async run(message, _args) {
        const { player } = this.client
        const { member, guild } = message
        if (!member.voice) return message.channel.send(`You must be in a voice channel to use this command`)
        const { channel } = member.voice

        let queue = player.createQueue(guild.id, {
            data: {
                message: message
            }
        })
        queue.join(channel)
    }
}