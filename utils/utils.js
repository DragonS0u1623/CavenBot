const { BOTID, HOMESERVERID } = require('./../utils/statics')
const path = require('path')
const { readdirSync } = require('fs')
const { REST, Routes } = require('discord.js')

module.exports.loadCommands = async (client) => {
    const commandFolders = path.join(__dirname, '../commands')
    const folders = readdirSync(commandFolders)
    
    for (const folder of folders) {
        const commandFiles = readdirSync(path.join(commandFolders, folder)).filter(file => file.endsWith('.js'))

        for (const file of commandFiles) {
            const command = require(path.join(commandFolders, folder, file))

            if (!(command.data && command.execute)) throw new TypeError(`Command ${command} is not a command object.`)

            client.commands.set(command.data.name, command)
        }
    }
}

module.exports.updateRegisteredCommands = async (client) => {
    const rest = new REST().setToken(process.env.TOKEN || '')
    const commands = client.commands.map(command => command.data.toJSON())

    try {
        await rest.put(
            Routes.applicationCommands(BOTID),
            { body: commands }
        )
    } catch (error) {
        console.error(error)
    }
}

module.exports.updateRegisteredTestCommands = async (client) => {
    const rest = new REST().setToken(process.env.TOKEN || '')
    const rebuildDB = require('../commands/utils/rebuildDB')
    const commands = [rebuildDB.data.toJSON()]

    try {
        await rest.put(
            Routes.applicationGuildCommands(BOTID, HOMESERVERID),
            { body: commands }
        )
    } catch (error) {
        console.error(error)
    }
}

module.exports.loadEvents = async (client) => {
    const eventFolders = path.join(__dirname, '../events')
    const folders = readdirSync(eventFolders)

    for (const folder of folders) {
        const eventFiles = readdirSync(path.join(eventFolders, folder)).filter(file => file.endsWith('.js'))

        for (const file of eventFiles) {
            const event = require(path.join(eventFolders, folder, file))

            if (!(event.name && event.execute)) throw new TypeError(`Event ${event} is not an event object.`)

            if (event.once)
                client.once(event.name, (...args) => event.execute(client, ...args))
            else
                client.on(event.name, (...args) => event.execute(client, ...args))
        }
    }
    
}

module.exports.findEmoji = (client, { nameOrId }) => {
	return client.emojis.cache.get(nameOrId) || client.emojis.cache.find(emoji => emoji.name?.toLowerCase() === nameOrId.toLowerCase())
}