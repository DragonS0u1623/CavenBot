import { ChatInputCommandInteraction, Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { FOOTER, OWNERPFP } from '../../utils/statics'

export default {
    data: new SlashCommandBuilder().setName('pfp').setDescription('Sends the user\'s pfp')
            .addUserOption(option => option.setName('user').setDescription('The user you want to see the pfp of').setRequired(false)),
	async execute(interaction: ChatInputCommandInteraction) {
        let user = interaction.options.getUser('user')
        if (!user) user = interaction.user

        const embed = new EmbedBuilder()
            .setTitle(`${user}'s pfp`)
            .setURL(user.avatarURL())
            .setImage(user.avatarURL())
            .setColor(Colors.Red)
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })

		await interaction.reply({ embeds: [embed] })
	}
}