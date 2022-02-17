const Command = require('../../../structures/Command')
const remindSchema = require('../../../models/reminders')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'reminder',
			category: 'Misc',
			description: 'Shows your reminders or adds/removes one from the list',
			expectedArgs: '[add/remove] [reminder/num]',
			slash: true,
			data: new SlashCommandBuilder().setName('reminder').setDescription('Parent command for reminders')
				.addSubcommand((subcommand) => subcommand.setName('add').setDescription('Adds a new reminder to the list.')
					.addStringOption((option) => option.setName('reminder').setDescription('The reminder you want to add').setRequired(true)))
				.addSubcommand((subcommand) => subcommand.setName('remove').setDescription('Removes the reminder from the list.')
					.addIntegerOption((option) => option.setName('position').setDescription('The position of the reminder you want to remove. Starts at 1').setRequired(true)))
				.addSubcommand((subcommand) => subcommand.setName('view').setDescription('Shows your reminders'))
		})
	}

	async executeSlash(interaction) {
		const { guild, user } = interaction
		
		if (interaction.options.getSubcommand() === 'add') {
			await interaction.deferReply()
			const reminder = interaction.options.getString('reminder')

			const doc = await remindSchema.findOne({ guildId: guild.id, userId: user.id })
			if (!doc) {
				new remindSchema({
					guildId: guild.id,
					userId: user.id,
					reminders: [
						{
							num: 1,
							reminder
						}
					]
				}).save()
				return interaction.editReply('Added your reminder to the list')
			}

			let x = 1
			doc.reminders.forEach(() => x++)

			await remindSchema.findOneAndUpdate({ guildId: guild.id, userId: user.id }, { $push: { reminders: { num: x, reminder } } })
			return interaction.editReply('Added your reminder to the list')
		} else if (interaction.options.getSubcommand() === 'remove') {
			await interaction.deferReply()
			const num = interaction.options.getInteger('position')

			const doc = await remindSchema.findOne({ guildId: guild.id, userId: user.id })
			if (!doc) return interaction.editReply(`You don't have any reminders`)
			if (num > doc.reminders.length) return interaction.editReply(`There are only ${doc.reminders.length} reminders`)
			const { reminders } = doc
			const newReminders = []
			reminders.forEach(reminder => {
				if (reminder.num !== num) newReminders.push(reminder)
			})

			newReminders.forEach(rem => {
				if (rem.num > num) rem.num -= 1
			})

			if (!newReminders.length) await remindSchema.findOneAndDelete({ guildId: guild.id, userId: user.id })
			else await remindSchema.findOneAndUpdate({ guildId: guild.id, userId: user.id }, { reminders: newReminders })
			return interaction.editReply(`Removed reminder from the list`)
		} else if (interaction.options.getSubcommand() === 'view') {
			await interaction.deferReply()

			const doc = await remindSchema.findOne({ guildId: guild.id, userId: user.id })
			if (!doc) return interaction.editReply(`Lucky you. You don't have any reminders`)

			let reply = `Reminders for ${interaction.user}\n`
			const { reminders } = doc
			reminders.forEach(rem => { reply += `**${rem.num}:** ${rem.reminder}` })
			return interaction.editReply(reply)
		} else return interaction.reply('Please use one of the subcommands `view`, `add` or `remove`')
	}

	async run(message, args) {
		const { guild } = message
		if (!args) {
			const doc = await remindSchema.findOne({ guildId: guild.id, userId: message.author.id })
			if (!doc) return message.channel.send(`Lucky you. You don't have any reminders`)

			let reply = `Reminders for ${message.author}\n`
			const { reminders } = doc
			reminders.forEach(rem => { reply += `**${rem.num}:** ${rem.reminder}` })
			return message.channel.send(reply)
		} else if (args.shift === 'add') {
			const reminder = args.shift()

			const doc = await remindSchema.findOne({ guildId: guild.id, userId: message.author.id })
			if (!doc) {
				new remindSchema({
					guildId: guild.id,
					userId: message.author.id,
					reminders: [
						{
							num: 1,
							reminder
						}
					]
				}).save()
				return message.channel.send('Added your reminder to the list')
			}

			let x = 1
			doc.reminders.forEach(() => x++)

			await remindSchema.findOneAndUpdate({ guildId: guild.id, userId: message.author.id }, { $push: { reminders: { num: x, reminder } } })
			return message.channel.send('Added your reminder to the list')
		} else if (args.shift === 'remove') {
			const num = parseInt(args.shift())
			if (!num) return message.channel.send(`Please enter a valid number >= 1`)
			const doc = await remindSchema.findOne({ guildId: guild.id, userId: message.author.id })
			if (!doc) return message.channel.send(`You don't have any reminders`)

			if (num > doc.reminders.length) return message.channel.send(`There are only ${doc.reminders.length} reminders`)

			const { reminders } = doc

			const newReminders = []
			reminders.forEach(reminder => {
				if (reminder.num !== num) newReminders.push(reminder)
			})

			newReminders.forEach(rem => {
				if (rem.num > num) rem.num -= 1
			})

			if (!newReminders.length) await remindSchema.findOneAndDelete({ guildId: guild.id, userId: message.author.id })
			else await remindSchema.findOneAndUpdate({ guildId: guild.id, userId: message.author.id }, { reminders: newReminders })
			return message.channel.send(`Removed reminder from the list`)
		} else return message.channel.send('Please provide either no arguments to view your reminders, or add/remove if you want to add or remove them.')
	}
}