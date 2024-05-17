const { Events } = require('discord.js')
const axios = require('axios')
const { BOTID } = require('../../utils/statics')
const prisma = require('../../utils/prisma')

module.exports = {
	name: Events.GuildDelete,
	once: false,
	async execute(client, guild) {
		await prisma.admins.deleteOne({
			where: { guildId: guild.id }
		})
		await prisma.serversettings.delete({
			where: { guildId: guild.id }
		})

		await axios.post(`https://discord.bots.gg/api/v1/bots/${BOTID}/stats`, { shards: 1, guilds: guild.client.guilds.cache.size }, { headers: { 'Authorization': `${process.env.DBOTS_KEY}` } })
	}
}