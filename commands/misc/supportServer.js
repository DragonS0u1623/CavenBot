const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/statics')

module.exports = {
	data: new SlashCommandBuilder().setName('support').setDescription('Sends an embed with the invite link to the official support server'),
	async execute(interaction) {
        const invite = 'https://discord.gg/6TjuPYy'

        const embed = new EmbedBuilder()
            .setTitle('Invite to the Support Server')
            .setURL(invite)
            .setTimestamp(new Date())
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		interaction.user.createDM().then(channel => channel.send({ embeds: [embed] }))
	}
}