const Command = require('../../structures/Command.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'queue',
            aliases: ['q'],
            category: 'Music',
            description: 'Shows the current queue',
            slash: true,
            data: new SlashCommandBuilder().setName('queue').setDescription('Shows the current queue')
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const { player } = this.client
        if (!player.hasQueue(interaction.guild.id)) return interaction.editReply(`I am not in a voice channel and there is no music playing`)
        let queue = player.getQueue(interaction.guild.id)
       
        let embed = new MessageEmbed().setTitle('Song Queue').setColor('#ff0000')
        let songs = queue.songs.slice(1)
        let i = 1
        for (const song of songs) {
            embed.addField(`${i++}`, `[${song.name}](${song.url})`, false)
            if (i == 25) {
                embed.addField(`${i}`, `And ${songs.length-i} more songs`, false)
                break
            }
        }
        
        interaction.editReply({ embeds: [embed] })
    }

    async run(message, _args) {
        const { player } = this.client
        if (!player.hasQueue(message.guild.id)) return message.channel.send(`I am not in a voice channel and there is no music playing`)
        let queue = player.getQueue(message.guild.id)

        let embed = new MessageEmbed().setTitle('Song Queue').setColor('#ff0000')
        let songs = queue.songs.slice(1)
        let i = 1
        for (const song of songs) {
            embed.addField(`${i++}`, `[${song.name}](${song.url})`, false)
            if (i == 25) {
                embed.addField(`${i}`, `And ${songs.length-i} more songs`, false)
                break
            }
        }
        
        message.channel.send({ embeds: [embed] })
    }
}