const Command = require('../../structures/Command')
const serverSchema = require('../../models/serverSchema')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'roledm',
			category: 'React Roles',
			description: 'Toggles the DM settings for role reactions. By default this is enabled',
			slash: true,
			data: new SlashCommandBuilder().setName('roledm').setDescription('Toggles the DM settings for role reactions. By default this is enabled')
				.addBooleanOption((option) => option.setName('enable').setDescription('Enable or Disable DM messages for react roles').setRequired(false))
		})
	}

	async executeSlash(interaction) {
		await interaction.deferReply()
		const { guild } = interaction

		const doc = await serverSchema.findOne({ guildId: guild.id })

		let dm = interaction.options.getBoolean('enable') || null
		if (dm === null) dm = !doc.roledm

		await serverSchema.findOneAndUpdate({ guildId: guild.id }, { roledm: dm })
		return interaction.editReply(`${dm ? 'Enabled' : 'Disabled'} DM messages for role reactions in this server.`)
	}

	async run(message, args) {
		const { guild } = message

		const doc = await serverSchema.findOne({ guildId: guild.id })

		let dm = (args.shift() === 'true' || args.shift() === 'on') || null
		if (dm === null) dm = !doc.roledm

		await serverSchema.findOneAndUpdate({ guildId: guild.id }, { roledm: dm })
		return message.channel.send(`${dm ? 'Enabled' : 'Disabled'} DM messages for role reactions in this server.`)
	}
}