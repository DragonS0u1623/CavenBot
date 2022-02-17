const Command = require('../../structures/Command.js')
const { MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { HOMESERVERID, npEmote } = require('../../utils/StaticVars')

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            name: 'nowplaying',
            aliases: ['np', 'now'],
            category: 'Music',
            description: 'Shows the currently playing song',
            slash: true,
            data: new SlashCommandBuilder().setName('nowplaying').setDescription('Shows the currently playing song')
        })
    }

    async executeSlash(interaction) {
        await interaction.deferReply()
        const { player } = this.client
        if (!player.hasQueue(interaction.guild.id)) return interaction.editReply(`I am not in a voice channel and there is no music playing`)
        let queue = player.getQueue(interaction.guild.id)

        const homeServer = this.client.guilds.fetch(HOMESERVERID)
        const emote = homeServer.emojis.fetch(npEmote)
       
        const song = queue.nowPlaying

        const embed = new MessageEmbed().setTitle(`${emote} ${song.name} ${emote}`)
            .setURL(`${song.url}`)
            .setDescription(`${song.author}`)
            .setColor('#ff0000')
            .setThumbnail(`${song.thumbnail}`)
            .setTimestamp()
            .addField('Requested By', `${song.requestedBy}`, false)

        interaction.editReply({ embeds: [embed] })
    }

    async run(message, _args) {
        const { player } = this.client
        if (!player.hasQueue(message.guild.id)) return message.channel.send(`I am not in a voice channel and there is no music playing`)
        let queue = player.getQueue(message.guild.id)

        const homeServer = this.client.guilds.fetch(HOMESERVERID)
        const emote = homeServer.emojis.fetch(npEmote)
        
        const song = queue.nowPlaying

        const embed = new MessageEmbed().setTitle(`${emote} ${song.name} ${emote}`)
            .setURL(`${song.url}`)
            .setDescription(`${song.author}`)
            .setColor('#ff0000')
            .setThumbnail(`${song.thumbnail}`)
            .setTimestamp()
            .addField('Requested By', `${song.requestedBy}`, false)

        message.channel.send({ embeds: [embed] })
    }
}