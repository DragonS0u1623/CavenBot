const { Events } = require('discord.js')
const { BOTID } = require('../../utils/statics')
const axios = require('axios')
const prisma = require('../../utils/prisma')

module.exports = {
	name: Events.GuildCreate,
	once: false,
	async execute(client, guild) {
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