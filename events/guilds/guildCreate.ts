import { Client, Events, Guild } from 'discord.js'
import { BOTID } from '../../utils/statics.js'
import axios from 'axios'
import prisma from '../../utils/prisma.js'
import { CavenBot } from '../../types/types.js'

export default {
	name: Events.GuildCreate,
	once: false,
	async execute(client: Client, guild: Guild) {
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
		await prisma.musicsettings.create({
			data: {
				guildId: guild.id,
				requesterNotInVCSkip: false,
				defaultVolume: (client as CavenBot).defaultVolume
			}
		})

		await axios.post(`https://discord.bots.gg/api/v1/bots/${BOTID}/stats`, { shards: 1, guilds: guild.client.guilds.cache.size }, { headers: { 'Authorization': `${process.env.DBOTS_KEY}` } })
	}
}