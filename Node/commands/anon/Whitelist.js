const Command = require('../../structures/Command.js')
const blacklistSchema = require('../../models/blacklist.js')

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'whitelist',
			category: 'Anon',
			description: 'Whitelists the channel or the user from using anon commands',
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
				if (!doc) return message.channel.send(`There are no blacklisted users or channels in your server`)

				const { users } = doc
				if (!users.includes(user.id)) return message.channel.send(`That user is not blacklisted from anon commands`)

				await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $pull: { users: user.id } })
				return message.channel.send(`Whitelisted the user ${user}`)
			}

			const doc = await blacklistSchema.findOne({ guildId: guild.id })
			if (!doc) return message.channel.send(`There are no blacklisted users or channels in your server`)

			const { channels } = doc
			if (!channels.includes(channel.id)) return message.channel.send(`That channel is not blacklisted from anon commands`)

			await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $pull: { channels: channel.id } })
			return message.channel.send(`Whitelisted the channel ${channel}`)
		} else if (isChannel) {
			tag = tag.slice(2, tag.length - 1)
			const channel = await guild.channels.fetch(tag)
			if (!channel) return message.channel.send(`Please tag a channel within this server`)

			const doc = await blacklistSchema.findOne({ guildId: guild.id })
			if (!doc) return message.channel.send(`There are no blacklisted users or channels in your server`)

			const { channels } = doc
			if (!channels.includes(channel.id)) return message.channel.send(`That channel is not blacklisted from anon commands`)

			await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $pull: { channels: channel.id } })
			return message.channel.send(`Whitelisted the channel ${channel}`)
		} else if (isUser) {
			tag = tag.slice(2, tag.length - 1)
			const user = await guild.members.fetch(tag)
			if (!user) return message.channel.send(`Please tag a user in this server`)

			const doc = await blacklistSchema.findOne({ guildId: guild.id })
			if (!doc) return message.channel.send(`There are no blacklisted users or channels in your server`)

			const { users } = doc
			if (!users.includes(user.id)) return message.channel.send(`That user is not blacklisted from anon commands`)

			await blacklistSchema.findOneAndUpdate({ guildId: guild.id }, { $pull: { users: user.id } })
			return message.channel.send(`Whitelisted the user ${user}`)
		}
	}
}