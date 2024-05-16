import { Client, Collection, CommandInteraction, Events, SlashCommandBuilder } from 'discord.js'
import { LavalinkManager } from 'lavalink-client/dist/types'

export interface CavenBot extends Client {
    lavalink: LavalinkManager
    defaultVolume: number
    commands: Collection<string, Command>
    events: Collection<Events, Event>
}

export interface Command {
    data: SlashCommandBuilder,
    execute: (interaction: CommandInteraction) => void
}

export interface Event {
    name: string,
    once: boolean,
    execute: (...args: any[]) => void
}

export function isCommand(command: any): command is Command {
    return command.data && command.execute
}

export function isEvent(event: any): event is Event {
    return event.name && event.once && event.execute
}