const Command = require('../../structures/Command')
const reactSchema = require('../../models/reactRoles')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'roletoggle',
			category: 'React Roles',
			description: 'Sets whether roles on this message id toggle on or off',
			expectedArgs: '[channel ID] [message ID]',
			slash: true,
			data: new SlashCommandBuilder().setName('roletoggle')
				.setDescription('Sets whether roles on this message id toggle on or off')
				.addChannelOption((option) => option.setName('channel').setDescription('The channel the message is in.').setRequired(true))
				.addStringOption((option) => option.setName('message').setDescription('The message ID for the message that you want to toggle react roles for').setRequired(true))
				.addBooleanOption((option) => option.setName('enable').setDescription(`Enable or Disable toggle for this message's react roles`).setRequired(false))
		})
	}

	async executeSlash(interaction) {
		await interaction.deferReply()
		const { guild } = interaction
		const channel = interaction.getChannel('channel')
		const messageID = interaction.options.getString('message')
		const message = await channel.messages.fetch(messageID)
		if (!message) return interaction.editReply('The message ID you provided did not give a message. Please check to make sure you gave the correct channel and ID')

		const doc = reactSchema.findOne({ guildId: guild.id })
		if (!doc) return interaction.editReply(`There are no react roles set up for this server`)
		const { channels } = doc
		if (!channels.has(channel.id)) return interaction.editReply(`There are no react roles set up for that channel`)
		const { messages } = channels.get(channel.id)
		if (!messages.has(messageID)) return interaction.editReply(`There are no react roles set up for the message you provided`)

		let toggle = interaction.options.getBoolean('enable') || null
		if (toggle === null) toggle = !messages.get(messageID).toggle

		await reactSchema.findOneAndUpdate({ guildId: guild.id }, { channels: { [`${channel.id}`]: { messages: { [`${messageID}`]: { toggle } } } } })
		return interaction.editReply(`${toggle ? 'Enabled' : 'Disabled'} toggle for reaction roles.`)
	}

	async run(message, args) {
		const { guild } = message
		let channelStr = args.shift()
		if (channelStr.startsWith('<#'))
			channelStr = channelStr.slice(2, channelStr.length - 1)
		const channel = await guild.channels.fetch(channelStr)
		const messageID = args.shift()
		const reactMessage = await channel.messages.fetch(messageID)
		if (!reactMessage) return message.channel.send('The message ID you provided did not give a message. Please check to make sure you gave the correct channel and ID')

		const doc = reactSchema.findOne({ guildId: guild.id })
		if (!doc) return message.channel.send(`There are no react roles set up for this server`)
		const { channels } = doc
		if (!channels.has(channel.id)) return message.channel.send(`There are no react roles set up for that channel`)
		const { messages } = channels.get(channel.id)
		if (!messages.has(messageID)) return message.channel.send(`There are no react roles set up for the message you provided`)

		let toggle = args.shift() || null
		if (toggle === null) toggle = !messages.get(messageID).toggle

		await reactSchema.findOneAndUpdate({ guildId: guild.id }, { channels: { [`${channel.id}`]: { messages: { [`${messageID}`]: { toggle } } } } })
		return message.channel.send(`${toggle ? 'Enabled' : 'Disabled'} toggle for reaction roles.`)
	}
}