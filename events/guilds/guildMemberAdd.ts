import { ChannelType, Colors, EmbedBuilder, Events, GuildMember } from 'discord.js'
import moment from 'moment'
import { FOOTER, OWNERPFP } from '../../utils/statics.js'
import prisma from '../../utils/prisma.js'

export default {
    name: Events.GuildMemberAdd,
    once: false,
	async execute(member: GuildMember) {
        const { guild } = member
        const serverSettings = await prisma.serversettings.findUnique({
            where: { guildId: guild.id }
        })
        const { audits, welcome } = serverSettings
        if ((!audits && !welcome) || member.user.bot) return

        const admin = await prisma.admins.findUnique({
            where: { guildId: guild.id }
        })

        if (audits) {
            guild.channels.fetch(admin.audits).then(channel => {
                if (!channel || channel.type !== ChannelType.GuildText) return

                const embed = new EmbedBuilder()
                    .setTitle(`Member Joined: ${member}`)
                    .setDescription(`Joined the server`)
                    .setThumbnail(`${member.avatarURL()}`)
                    .setColor(Colors.Green)
                    .setTimestamp()
                    .addFields(
                        { name: `Joined at`, value: `<t:${member.joinedTimestamp}>`, inline: false },
                        { name: `Created at`, value: `<t:${member.user.createdTimestamp}>`, inline: false })
                    .setFooter({ text: FOOTER, iconURL: OWNERPFP })
                
                const now = moment()
                const createDate = moment(member.user.createdAt)
                
                if (createDate.add(2, 'weeks').isAfter(now)) embed.addFields({ name: ':warning:Warning! This account is under 2 weeks old. Be careful!:warning:', value: '', inline: false })
                channel.send({ embeds: [embed] })
            })
        }

        if (welcome) {
            guild.channels.fetch(admin.welcome).then(channel => {
                if (!channel || channel.type !== ChannelType.GuildText) return

                const embed = new EmbedBuilder()
                    .setTitle(`Member Joined: ${member}`)
                    .setDescription(`${admin.welcome_message}`)
                    .setColor(Colors.Green)
                    .setThumbnail(member.avatarURL())
                    .setTimestamp()
                    .setFooter({ text: FOOTER, iconURL: OWNERPFP })
                channel.send({ embeds: [embed] })
            })
        }
	}
}