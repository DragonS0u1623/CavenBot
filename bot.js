const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js')
const utils = require('./utils/utils')
const { BOTID } = require('./utils/statics')
const { LavalinkManager } = require('lavalink-client')

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
})

client.commands = new Collection()
client.events = new Collection()

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

client.on('raw', data => client.lavalink.sendRawData(data))

client.lavalink.on('trackStart', (player, track) => {
    const channel = client.guilds.cache.find(guild => guild.id === player.guildId)?.channels.cache.find(channel => channel.id === player.textChannelId)

    channel.send(`Now playing: ${track.info.title} by ${track.info.author}`)
})

client.lavalink.on('trackEnd', (player, track, reason) => {
    const channel = client.guilds.cache.find(guild => guild.id === player.guildId)?.channels.cache.find(channel => channel.id === player.textChannelId)

    channel.send(`Song ended`)
})

client.lavalink.on('queueEnd', player => {
    const channel = client.guilds.cache.find(guild => guild.id === player.guildId)?.channels.cache.find(channel => channel.id === player.textChannelId)

    channel.send('The queue has ended. Queue more songs with `/play`')
})

client.lavalink.on('trackError', (player, track, error) => {
    const channel = client.guilds.cache.find(guild => guild.id === player.guildId)?.channels.cache.find(channel => channel.id === player.textChannelId)

    channel.send(`An error occurred while playing ${track.info.title}: ${error.error}`)
})

async function start() {
    await utils.loadCommands(client)
    await utils.loadEvents(client)
    client.login(process.env.TOKEN)
}

start()