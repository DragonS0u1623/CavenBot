import { ChannelType, Client, Colors, EmbedBuilder, Events, GuildBan } from 'discord.js'
import { FOOTER, OWNERPFP } from '../../utils/statics.js'
import prisma from '../../utils/prisma.js'

export default {
    name: Events.GuildBanAdd,
    once: false,
	async execute(client: Client, ban: GuildBan) {
        const { guild } = ban
        const serverSettings = await prisma.serversettings.findUnique({
            where: { guildId: guild.id }
        })
        const { audits } = serverSettings
        if (!audits) return

        const admin = await prisma.admins.findUnique({
            where: { guildId: guild.id }
        })

        guild.channels.fetch(admin.audits).then(channel => {
            if (!channel || channel.type !== ChannelType.GuildText) return

            const embed = new EmbedBuilder()
                .setTitle(`Member Banned: ${ban.user} | ${ban.user.id}`)
                .setThumbnail(ban.user.avatarURL())
                .setColor(Colors.Red)
                .setTimestamp()
                .setFooter({ text: FOOTER, iconURL: OWNERPFP })

            if (ban.reason) embed.setDescription(ban.reason)
            channel.send({ embeds: [embed] })
        })
	}
}