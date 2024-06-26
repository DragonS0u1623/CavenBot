const { Events } = require('discord.js')
const axios = require('axios')
const { BOTID } = require('../../utils/statics')
const prisma = require('../../utils/prisma')

module.exports = {
	name: Events.GuildDelete,
	once: false,
	async execute(client, guild) {
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
				.then(results => results.reduce((acc, guildCount) => acc + guildCount, 0))
			},
			{ headers: { 'Authorization': `${process.env.DBOTS_KEY}` } })
	}
}