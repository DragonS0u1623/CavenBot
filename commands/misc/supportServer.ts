import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { FOOTER, OWNERPFP } from '../../utils/statics.js'

export default {
	data: new SlashCommandBuilder().setName('support').setDescription('Sends an embed with the invite link to the official support server'),
	async execute(interaction: ChatInputCommandInteraction) {
        const invite = 'https://discord.gg/6TjuPYy'

        const embed = new EmbedBuilder()
            .setTitle('Invite to the Support Server')
            .setURL(invite)
            .setTimestamp(new Date())
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })
		interaction.user.createDM().then(channel => channel.send({ embeds: [embed] }))
	}
}