const Command = require('../../structures/Command.js')
const adminSchema = require('../../models/admin')
const { nanoid } = require('nanoid')
const { MessageEmbed } = require('discord.js')

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'send',
			category: 'Anon',
			description: 'Sends a message anonymously in the given channel.',
			expectedArgs: '[guild] [channel] [message]',
			guildOnly: false
		})
	}

	async run(message, args) {
		if (message.guild) return message.channel.send(`You need to use this command in DMs with the bot.`)
		if (args.length < 3) return message.channel.send(`You need to give at least 3 arguments for this command. [GuildId] [ChannelID] and [message]`)

		const guildId = args.shift()
		const channelID = args.shift()
		const guild = await this.client.guilds.fetch(guildId)
		if (!guild) return message.channel.send(`The guild ID you provided didn't give a valid guild. Please check to make sure that the ID is correct`)
		const channel = await guild.channels.fetch(channelID)
		if (!channel) return message.channel.send(`The channel ID you provided didn't give a valid channel. Please check to make sure that the ID is correct`)
		console.log(guildId)
		console.log(guild)

		const doc = await adminSchema.findOne({ guildId: guild.id })
		console.log(doc)
		if (!doc || doc.audits === '0')
			return message.channel.send(`The guild that you are trying to use this command in doesn't have the commands set up. Try checking with the mods to enable anonymous messages`)

		console.log(`Guild has a db doc. Audit channel is ${doc.audits}`)
		guild.channels.fetch(doc.audits).then(auditChannel => {
			if (!auditChannel)
			return message.channel.send(`The guild that you are trying to use this command in doesn't have the commands set up. Try checking with the mods to enable anonymous messages`)

			let sendMessage = args.join(' ')

			const anonSendID = nanoid(12)
			sendMessage += `\nAnon Sender: ${anonSendID}`;

			channel.send(sendMessage)
				.then(m => {
					const id = m.id

					const embed = new MessageEmbed()
						.setTitle('New Anonymous Message').setDescription(`A new anonymous message has been sent by ${m.author}`)
						.addField(`[Channel ID](${channel.url})`, `${channel.id}`, true).addField(`[Message ID](${m.url})`, `${id}`, true)
						.addField('Anonymous Message ID', `${anonSendID}`, false)
					auditChannel.send({embeds: [embed]})

					message.react('✅')
				})
				.catch(err => {
					message.react('❌')
					console.log(err)
				})
		})
	}
}