import { Client, Events } from 'discord.js'
import { CavenBot } from '../../types/types'

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client) {
        if (!client.user) return
        
        console.log(`Logged in as ${client.user.tag}`)
        await (client as CavenBot).lavalink.init({ ...client.user! })
    }
}