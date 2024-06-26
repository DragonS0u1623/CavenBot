import { ChannelType, Client, Colors, EmbedBuilder, Events, GuildMember } from 'discord.js'
import { FOOTER, OWNERPFP } from '../../utils/statics.js'
import prisma from '../../utils/prisma.js'

export default {
    name: Events.GuildMemberRemove,
    once: false,
	async execute(client: Client, member: GuildMember) {
        const { guild } = member
        const serverSettings = await prisma.serversettings.findUnique({
            where: { guildId: guild.id }
        })
        const { audits } = serverSettings
        if (!audits || member.user.bot) return

        const admin = await prisma.admins.findUnique({
            where: { guildId: guild.id }
        })

        guild.channels.fetch(admin.audits).then(channel => {
            if (!channel || channel.type !== ChannelType.GuildText) return

            const embed = new EmbedBuilder()
                .setTitle(`Member Left: ${member}`)
                .setDescription('Left the server')
                .setThumbnail(member.avatarURL())
                .setColor(Colors.Purple)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            let rolesString = ''
            member.roles.cache.forEach(role => rolesString += `${role} `)
            embed.addFields({ name: 'Roles At Time:', value: rolesString, inline: false })

            channel.send({ embeds: [embed] })
        })
	}
}