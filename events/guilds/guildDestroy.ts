import { Client, Events, Guild } from 'discord.js'
import axios from 'axios'
import { BOTID } from '../../utils/statics.js'
import prisma from '../../utils/prisma.js'

export default {
	name: Events.GuildDelete,
	once: false,
	async execute(client: Client, guild: Guild) {
		await prisma.admins.delete({
			where: { guildId: guild.id }
		})
		await prisma.serversettings.delete({
			where: { guildId: guild.id }
		})
		await prisma.musicsettings.delete({
			where: { guildId: guild.id }
		})
		await prisma.reminders.deleteMany({
			where: { guildId: guild.id }
		})

		await axios.post(`https://discord.bots.gg/api/v1/bots/${BOTID}/stats`, {
			shards: client.shard.count,
			guilds: client.shard.fetchClientValues('guilds.cache.size')
				.then((results: number[]) => results.reduce((acc, guildCount) => acc + guildCount, 0))
			},
			{ headers: { 'Authorization': `${process.env.DBOTS_KEY}` } })
	}
}