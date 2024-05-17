const { SlashCommandBuilder } = require('discord.js')
const prisma = require('../../../utils/prisma')

module.exports = {
	data: new SlashCommandBuilder().setName('reminder').setDescription('Parent command for reminders')
		.addSubcommand((subcommand) => subcommand.setName('add').setDescription('Adds a new reminder to the list.')
			.addStringOption((option) => option.setName('reminder').setDescription('The reminder you want to add').setRequired(true)))
		.addSubcommand((subcommand) => subcommand.setName('remove').setDescription('Removes the reminder from the list.')
			.addIntegerOption((option) => option.setName('position').setDescription('The position of the reminder you want to remove. Starts at 1').setRequired(true)))
		.addSubcommand((subcommand) => subcommand.setName('view').setDescription('Shows your reminders'))
		.setDMPermission(false),
	async execute(interaction) {
		const { guild, user } = interaction
		let doc, reminders

		switch (interaction.options.getSubcommand()) {
			case 'add':
				await interaction.deferReply()
				const reminder = interaction.options.getString('reminder', true)

				doc = await prisma.reminders.findUnique({ 
					where: { guildId: guild.id, userId: user.id } 
				})
				if (!doc) {
					await prisma.reminders.create({
						data: {
							guildId: guild.id,
							userId: user.id,
							reminders: [
								{
									num: 1,
									reminder
								}
							]
						}
					})
					return interaction.editReply('Added your reminder to the list')
				}

				let x = 1
				doc.reminders.forEach(() => x++)

				await prisma.reminders.update({
					where: { guildId: guild.id, userId: user.id },
					data: { reminders: { num: x, reminder } }
				})
				await interaction.editReply('Added your reminder to the list')

				break
			case 'remove':
				await interaction.deferReply()
				const num = interaction.options.getInteger('position', true)

				doc = await prisma.reminders.findUnique({ where: { guildId: guild.id, userId: user.id } })
				if (!doc) 
					return interaction.editReply(`You don't have any reminders`)
				
				if (num > doc.reminders.length)
					return interaction.editReply(`There are only ${doc.reminders.length} reminders`)
				
				reminders = doc.reminders
				const newReminders = []
				reminders.forEach(reminder => {
					if (reminder.num !== num) newReminders.push(reminder)
				})

				newReminders.forEach(rem => {
					if (rem.num > num) rem.num -= 1
				})

				if (!newReminders.length) await prisma.reminders.delete({ where: { guildId: guild.id, userId: user.id } })
				else await prisma.reminders.update({
					where: { guildId: guild.id, userId: user.id },
					data: { reminders: newReminders }
				})

				await interaction.editReply(`Removed reminder from the list`)
				break
			case 'view':
				await interaction.deferReply()

				doc = await prisma.reminders.findUnique({ where: { guildId: guild.id, userId: user.id } })
				if (!doc)
					return interaction.editReply(`Lucky you. You don't have any reminders`)

				let reply = `Reminders for ${interaction.user}\n`
				reminders = doc.reminders
				reminders.forEach(rem => { reply += `**${rem.num}:** ${rem.reminder}` })
				await interaction.editReply(reply)
				break
			default:
				return
		}
	}
}