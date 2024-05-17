const { ChannelType, Colors, EmbedBuilder, Events } = require('discord.js')
const { FOOTER, OWNERPFP } = require('../../utils/statics')
const prisma = require('../../utils/prisma')

module.exports = {
    name: Events.GuildMemberRemove,
    once: false,
	async execute(client, member) {
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