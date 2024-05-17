const { Events } = require('discord.js')
const { updateRegisteredCommands } = require('../../utils/utils')

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        if (!client.user) return
        
        console.log(`Logged in as ${client.user.tag}`)
        updateRegisteredCommands(client)
        await client.lavalink.init({ ...client.user })
    }
}