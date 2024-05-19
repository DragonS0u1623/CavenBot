import { ChatInputCommandInteraction, InteractionEditReplyOptions, SlashCommandBuilder } from "discord.js";
import { CavenBot } from "../../types/types";
import prisma from "../../utils/prisma";

export default {
    data: new SlashCommandBuilder().setName('musicsettings').setDescription('Change the music settings for the server').setDMPermission(false)
        .addSubcommand(subcommand => subcommand.setName('requesterNotInVCSkip').setDescription('Toggle whether to skip the song if the requester is not in the voice channel'))
        .addSubcommand(subcommand => subcommand.setName('defaultVolume').setDescription('Set the default volume for the bot')
            .addIntegerOption(option => option.setName('volume').setDescription('The volume to set').setRequired(true))),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()

        const guildId = interaction.guildId as string

        const subcommand = interaction.options.getSubcommand()
        switch (subcommand) {
            case 'requesterNotInVCSkip':
                const shouldSkip = await prisma.musicsettings.findUnique({
                    where: { guildId: guildId }
                }).then(data => data?.requesterNotInVCSkip)

                await prisma.musicsettings.update({
                    where: { guildId: guildId },
                    data: { requesterNotInVCSkip: !shouldSkip }
                })

                return interaction.editReply({ content: (shouldSkip ? 'Songs will be skipped when the requester is no longer in VC' : 'Songs will no longer skip when the requester is not in VC'), ephemeral: true } as InteractionEditReplyOptions)
            case 'defaultVolume':
                const volume = interaction.options.getInteger('volume', true)

                if (volume < 0 || volume > 100)
                    return interaction.editReply({ content: 'Invalid volume. The volume must be a number between 0 and 100', ephemeral: true } as InteractionEditReplyOptions)

                await prisma.musicsettings.update({
                    where: { guildId: guildId },
                    data: { defaultVolume: volume }
                })

                return interaction.editReply({ content: `Set the default volume to ${volume}`, ephemeral: true } as InteractionEditReplyOptions)
            default: 
                await interaction.editReply({ content: 'Invalid subcommand', ephemeral: true } as InteractionEditReplyOptions)
                break
        }
    }
}