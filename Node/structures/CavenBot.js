const { Client, Intents, Collection } = require('discord.js')
const Utils = require('../utils/Utils.js')
const mongo = require('../utils/mongo.js')

const intents = [
	Intents.FLAGS.DIRECT_MESSAGES,
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	Intents.FLAGS.GUILD_VOICE_STATES
]

module.exports = class CavenBot extends Client {
	constructor() {
		super({
			intents: intents,
			partials: ['USER', 'MESSAGE', 'GUILD_MEMBER', 'CHANNEL', 'REACTION']
		})

		this.commands = new Collection()
		this.aliases = new Collection()
		this.slashCommands = new Collection()
		this.events = new Collection()
		this.utils = new Utils(this)

		// eslint-disable-next-line no-unused-vars
		const mongoDB = mongo().then(() => {
			console.log('Connected to MongoDB')
		})
	}

	async start() {
		this.utils.loadCommands()
		this.utils.loadEvents()
		this.utils.loadSlashCommands()
		this.utils.loadTestSlashCommands()
		super.login(process.env.TOKEN)
	}

}