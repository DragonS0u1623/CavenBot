import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export default {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('Rolls a dice with the amount of sides given. Default is a normal 6-sided dice')
        .addIntegerOption(option => option.setName('sides').setDescription('The number of sides').setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()

        const sides = interaction.options.getInteger('sides') || 6
        let message = ''

        const roll = Math.floor(Math.random() * sides) + 1

        if (roll === 1 && sides === 20)
            message = `${interaction.user} rolled a d20. They got a 1. It's a critical fail!`
        else if (roll === sides && sides === 20)
            message = `${interaction.user} rolled a d20. They got a nat 20!`
        else
            message = `${interaction.user} rolled a d${sides}. They got a ${roll}`

        await interaction.editReply(message)
    }
}