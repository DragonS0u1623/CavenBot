const Command = require('../../structures/Command')
const adminSchema = require('../../models/admin')
const serverSchema = require('../../models/serverSchema')
const reactSchema = require('../../models/reactRoles')
const joinRole = require('../../models/joinRole')

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'mongo',
			hidden: true
		})
	}

	async run(message, args) {
        console.log('Rebuilding base server documents')

        const guilds = []

        this.client.guilds.cache.each(guild => {
            guilds.push(guild.id)
        })

        for (const guild of guilds) {
            await new adminSchema({
                guildId: guild,
                audits: '0',
                welcome: '0',
                welcome_message: 'Welcome to the server',
                language: 'en_US'
            }).save()
        }

        console.log('Finished resetting and rebuilding the MongoDB')
	}
}