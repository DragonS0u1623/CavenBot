const { SlashCommandBuilder } = require('discord.js')
const prisma = require('../../utils/prisma')

module.exports = {
    data: new SlashCommandBuilder().setName('rebuilddb').setDescription('Rebuilds the database')
        .setDefaultMemberPermissions(0).setDMPermission(false),
    async execute(interaction) {
        await interaction.reply({ content: 'Rebuilding the database...', ephemeral: true })
        console.log('Rebuilding the database...')

        await interaction.client.shard?.broadcastEval(client => {
            client.guilds.cache.forEach(async guild => {
                let guildData = await prisma.admins.findUnique({
                    where: { guildId: guild.id }
                })

                if (!guildData) {
                    await prisma.admins.create({
                        data: {
                            guildId: guild.id,
                            audits: '0',
                            welcome: '0',
                            welcome_message: 'Welcome to the server!'
                        }
                    })
                }

                guildData = await prisma.serversettings.findUnique({
                    where: { guildId: guild.id }
                })

                if (!guildData) {
                    await prisma.serversettings.create({
                        data: {
                            guildId: guild.id,
                            audits: false,
                            welcome: false
                        }
                    })
                }

                guildData = await prisma.musicsettings.findUnique({
                    where: { guildId: guild.id }
                })

                if (!guildData) {
                    await prisma.musicsettings.create({
                        data: {
                            guildId: guild.id,
                            requesterNotInVCSkip: false,
                            defaultVolume: 50
                        }
                    })
                }
            })
        })

        console.log('Database rebuilt.')
        await interaction.followUp({ content: 'Database rebuilt.', ephemeral: true })
    }
}