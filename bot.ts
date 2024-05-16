import { Client, GatewayIntentBits, Partials } from 'discord.js'
import * as utils from './utils/utils'
import { CavenBot } from './types/types'
import { LavalinkManager } from 'lavalink-client/dist/types'
import { BOTID } from './utils/statics'

const intents = [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates
]
const partials = [
    Partials.GuildMember,
    Partials.Reaction,
    Partials.Channel,
    Partials.Message,
    Partials.User
]

const client = new Client({
    intents,
    partials
}) as CavenBot

client.defaultVolume = 100
client.lavalink = new LavalinkManager({
    nodes: [
        {
            host: `${process.env.LAVALINK_HOST}`,
            port: 2333,
            authorization: `${process.env.LAVALINK_PASSWORD}`
        }
    ],
    sendToShard(guildId, payload) {
        client.guilds.cache.get(guildId)?.shard?.send(payload)
    },
    client: {
        id: BOTID,
        username: 'CavenBot#3674'
    },
    playerOptions: {
        defaultSearchPlatform: 'ytsearch',
        onDisconnect: {
            autoReconnect: false
        },
        onEmptyQueue: {
            destroyAfterMs: 30_000
        }
    },
    queueOptions: {
        maxPreviousTracks: 25
    }
})

async function start() {
    await utils.loadCommands(client)
    await utils.loadEvents(client)
    client.login(process.env.TOKEN)
}

start()