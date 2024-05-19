const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js')
const utils = require('./utils/utils')
const { BOTID } = require('./utils/statics')
const { LavalinkManager } = require('lavalink-client')
const prisma = require('./utils/prisma')

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

client.defaultVolume = 50
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
            destroyAfterMs: 30_0000
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

client.lavalink.on('trackEnd', async (player, track, payload) => {
    const channel = client.guilds.cache.find(guild => guild.id === player.guildId)?.channels.cache.find(channel => channel.id === player.textChannelId)

    const shouldSkip = await prisma.musicsettings.findUnique({
        where: {
            guildId: player.guildId
        }
    }).then(data => data?.requesterNotInVCSkip)

    switch (payload.reason) {
        case 'cleanup':
            break
        case 'finished':
            if (player.queue.tracks.length === 0) return
            if ((player.queue.tracks[0].requester.voice.channelId !== player.voiceChannelId) && shouldSkip) {
                player.skip()
                return channel.send('Requester not in voice channel. Skipping song.')
            }
            break
        case 'loadFailed':
            channel.send(`Failed to load ${track.info.title}`)
            break
        case 'replaced':
            channel.send('Song ended')
            break
        case 'stopped':
            break
        default:
            break
    }

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