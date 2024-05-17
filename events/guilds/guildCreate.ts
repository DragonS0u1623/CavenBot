import { Events, Guild } from 'discord.js'
import { BOTID } from '../../utils/statics.js'
import axios from 'axios'
import prisma from '../../utils/prisma.js'

export default {
	name: Events.GuildCreate,
	once: false,
	async execute(guild: Guild) {
		await prisma.admins.create({
			data: {
				guildId: guild.id,
				audits: '0',
				welcome: '0',
				welcome_message: 'Welcome to the server'
			}
		})
		await prisma.serversettings.create({
			data: {
				guildId: guild.id,
				welcome: false,
				audits: false
			}
		})

		await axios.post(`https://discord.bots.gg/api/v1/bots/${BOTID}/stats`, { shards: 1, guilds: guild.client.guilds.cache.size }, { headers: { 'Authorization': `${process.env.DBOTS_KEY}` } })
	}
}