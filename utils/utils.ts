import { CavenBot, isCommand, isEvent } from './../types/types.js'
import { BOTID } from './../utils/statics.js'
import path from 'path'
import { readdirSync } from 'fs'
import { Client, REST, Routes } from 'discord.js'

export async function loadCommands(client: CavenBot) {
    const commandFolders = path.join(__dirname, '../commands')
    const folders = readdirSync(commandFolders)
    
    for (const folder of folders) {
        const commandFiles = readdirSync(path.join(commandFolders, folder)).filter(file => file.endsWith('.js'))

        for (const file of commandFiles) {
            const command = require(path.join(commandFolders, folder, file))

            if (!isCommand(command)) throw new TypeError(`Command ${command} is not a command object.`)

            client.commands.set(command.data.name, command)
        }
    }
}

export async function updateRegisteredCommands(client: CavenBot) {
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

export async function loadEvents(client: CavenBot) {
    const eventFolders = path.join(__dirname, '../events')
    const folders = readdirSync(eventFolders)

    for (const folder of folders) {
        const eventFiles = readdirSync(path.join(eventFolders, folder)).filter(file => file.endsWith('.js'))

        for (const file of eventFiles) {
            const event = require(path.join(eventFolders, folder, file))

            if (!isEvent(event)) throw new TypeError(`Event ${event} is not an event object.`)

            if (event.once)
                client.once(event.name, (...args) => event.execute(client, ...args))
            else
                client.on(event.name, (...args) => event.execute(client, ...args))
        }
    }
    
}

export function findEmoji(client: Client, { nameOrId }: any) {
	return client.emojis.cache.get(nameOrId) || client.emojis.cache.find(emoji => emoji.name!.toLowerCase() === nameOrId.toLowerCase())
}