import { Events, Guild } from 'discord.js'
import axios from 'axios'
import { BOTID } from '../../utils/statics.js'
import prisma from '../../utils/prisma.js'

export default {
	name: Events.GuildDelete,
	once: false,
	async execute(guild: Guild) {
		await prisma.admins.deleteOne({
			where: { guildId: guild.id }
		})
		await prisma.serversettings.delete({
			where: { guildId: guild.id }
		})

		await axios.post(`https://discord.bots.gg/api/v1/bots/${BOTID}/stats`, { shards: 1, guilds: guild.client.guilds.cache.size }, { headers: { 'Authorization': `${process.env.DBOTS_KEY}` } })
	}
}