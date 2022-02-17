const Command = require('../../structures/Command.js')
const blacklistSchema = require('../../models/blacklist.js')

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'blacklist',
			category: 'Anon',
			description: 'Blacklists the channel or the user from using anon commands',
			expectedArgs: '[user/channel]'
		})
	}

	async run(message, args) {
		const { guild } = message
		if (!args.length) return message.channel.send(`You need to tag either a member or channel for this command`)
		let tag = args.shift()
		const isChannel = tag.startsWith('<#')
		const isUser = tag.startsWith('<@')

		if (!isUser && !isChannel) {
			const channel = await guild.channels.fetch(tag)
			if (!channel) {
				const user = await guild.members.fetch(tag)
				if (!user) return message.channel.send(`You need to give either the ID or tag a member or channel for this command. Please make sure that the ID given is correct`)

				const doc = await blacklistSchema.findOne({ guildId: guild.id })
				if (!doc) {
					new blacklistSchema({
						guildId: guild.id,
						channels: [],
						users: [user.id]
					}).save()
					return message.channel.send(`Blacklisted the user ${user}`)
				}

				const { users } = doc
				if (users.includes(user.id)) return message.channel.send(`That user is already blacklisted from anon commands`)

				await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $push: { users: user.id } })
				return message.channel.send(`Blacklisted the user ${user}`)
			}

			const doc = await blacklistSchema.findOne({ guildId: guild.id })
			if (!doc) {
				new blacklistSchema({
					guildId: guild.id,
					channels: [channel.id],
					users: []
				}).save()
				return message.channel.send(`Blacklisted the channel ${channel}`)
			}

			const { channels } = doc
			if (channels.includes(channel.id)) return message.channel.send(`That channel is already blacklisted from anon commands`)

			await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $push: { channels: channel.id } })
			return message.channel.send(`Blacklisted the channel ${channel}`)
		} else if (isChannel) {
			tag = tag.slice(2, tag.length - 1)
			const channel = await guild.channels.fetch(tag)
			if (!channel) return message.channel.send(`Please tag a channel within this server`)

			const doc = await blacklistSchema.findOne({ guildId: guild.id })
			if (!doc) {
				new blacklistSchema({
					guildId: guild.id,
					channels: [channel.id],
					users: []
				}).save()
				return message.channel.send(`Blacklisted the channel ${channel}`)
			}

			const { channels } = doc
			if (channels.includes(channel.id)) return message.channel.send(`That channel is already blacklisted from anon commands`)

			await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $push: { channels: channel.id } })
			return message.channel.send(`Blacklisted the channel ${channel}`)
		} else if (isUser) {
			tag = tag.slice(2, tag.length - 1)
			const user = await guild.members.fetch(tag)
			if (!user) return message.channel.send(`Please tag a user in this server`)

			const doc = await blacklistSchema.findOne({ guildId: guild.id })
			if (!doc) {
				new blacklistSchema({
					guildId: guild.id,
					channels: [],
					users: [user.id]
				}).save()
				return message.channel.send(`Blacklisted the user ${user}`)
			}

			const { users } = doc
			if (users.includes(user.id)) return message.channel.send(`That user is already blacklisted from anon commands`)

			await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $push: { users: user.id } })
			return message.channel.send(`Blacklisted the user ${user}`)
		}
	}
}