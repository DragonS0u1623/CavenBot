import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder, Guild } from 'discord.js'
import { FOOTER, OWNERPFP } from '../../utils/statics.js'

export default {
    data: new SlashCommandBuilder().setName('info').setDescription('Gives relevant info about the server')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        const guild = interaction.guild as Guild
        
        let botCount = 0, memberCount = 0
        guild.members.cache.forEach((member) => {
            if (member.user.bot)
				botCount++
			else
				memberCount++
        })

        const owner = await guild.fetchOwner()

        const embed = new EmbedBuilder().setTitle(`${guild.name}: ${guild.id}`).setDescription(`Created at: <t:${guild.createdTimestamp}>`)
            .addFields(
                { name: 'Members', value: `There are ${guild.memberCount} members in the server total\n**Actual Members:** ${memberCount}\n**Bots:** ${botCount}`, inline: false },
                { name: 'Roles', value: `There are ${guild.roles.cache.size} roles in the server`, inline: false },
                { name: 'Boosters', value: `${guild.premiumSubscriptionCount} people have boosted\nThe server is at tier ${guild.premiumTier}`, inline: false }
            )
            .setThumbnail(guild.iconURL())
            .setAuthor({ name: `${owner.user}`, iconURL: owner.user.displayAvatarURL() })
            .setTimestamp()
            .setFooter({ text: FOOTER, iconURL: OWNERPFP })

        await interaction.editReply({ embeds: [embed] })
    }
}