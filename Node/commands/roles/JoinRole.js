const Command = require('../../structures/Command')
const joinRoleSchema = require('../../models/joinRole')
const serverSchema = require('../../models/serverSchema')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'joinrole',
			category: 'React Roles',
			description: 'Sets the role to add to newly joined members and enables it. Using this with no role will disable it',
			expectedArgs: '<role>',
			slash: true,
			data: new SlashCommandBuilder().setName('joinrole')
				.setDescription('Sets the role to add to newly joined members and enables it. Using this with no role will disable it')
				.addRoleOption((option) => option.setName('role').setDescription('The role you want to use. Ignore this if you want to disable').setRequired(false))
		})
	}

	async executeSlash(interaction) {
		await interaction.deferReply()
		const { guild } = interaction
		const role = interaction.options.getRole('role')

		if (!role) {
			const doc = await joinRoleSchema.findOne({ guildId: guild.id })
			if (!doc) return interaction.editReply('There is no join role set up for this server. Please tag a role in the command if you want to use join roles.')

			await joinRoleSchema.findOneAndDelete({ guildId: guild.id })
			await serverSchema.findOneAndUpdate({ guildId: guild.id }, { joinrole: false })
			return interaction.editReply('Disabled join roles for this server.')
		}

		const doc = await joinRoleSchema.findOne({ guildId: guild.id })
		if (!doc) {
			await new joinRoleSchema({
				guildid: guild.id,
				role: role.id
			}).save()
			await serverSchema.findOneAndUpdate({ guildId: guild.id }, { joinrole: true })
			return interaction.editReply(`Join role for the server set to ${role}`)
		}

		await joinRoleSchema.findOneAndUpdate({ guildId: guild.id }, { role: role.id })
		return interaction.editReply(`Join role for the server set to ${role}`)
	}

	async run(message, args) {
		const { guild } = message
		let roleStr = args.shift()
		if (roleStr.startsWith('<@&'))
			roleStr = roleStr.slice(3, roleStr.length - 1)
		const role = await guild.roles.fetch(roleStr)

		if (!role) {
			const doc = await joinRoleSchema.findOne({ guildId: guild.id })
			if (!doc) return message.channel.send('There is no join role set up for this server. Please tag a role in the command if you want to use join roles.')

			await joinRoleSchema.findOneAndDelete({ guildId: guild.id })
			await serverSchema.findOneAndUpdate({ guildId: guild.id }, { joinrole: false })
			return message.channel.send('Disabled join roles for this server.')
		}

		const doc = await joinRoleSchema.findOne({ guildId: guild.id })
		if (!doc) {
			await new joinRoleSchema({
				guildid: guild.id,
				role: role.id
			}).save()
			await serverSchema.findOneAndUpdate({ guildId: guild.id }, { joinrole: true })
			return message.channel.send(`Join role for the server set to ${role}`)
		}

		await joinRoleSchema.findOneAndUpdate({ guildId: guild.id }, { role: role.id })
		return message.channel.send(`Join role for the server set to ${role}`)
	}
}