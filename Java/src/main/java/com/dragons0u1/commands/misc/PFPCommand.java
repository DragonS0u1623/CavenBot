package com.dragons0u1.commands.misc;

import com.jagrosh.jdautilities.command.*;
import com.jagrosh.jdautilities.command.Command;

import me.duncte123.botcommons.messaging.*;
import net.dv8tion.jda.api.*;
import net.dv8tion.jda.api.entities.*;

public class PFPCommand extends Command {

	// @Override
	// public void execute(SlashCommandContext ctx) {
	// 	User user = ctx.getAuthor();
	// 	if (ctx.getOption("user").getAsUser() != null)
	// 		user = ctx.getOption("user").getAsUser();
	// 	EmbedBuilder embed = EmbedUtils.embedImageWithTitle(String.format("%s's Profile Pic", user.getAsTag()),
	// 	user.getEffectiveAvatarUrl(), user.getEffectiveAvatarUrl());
	// 	ctx.reply(embed.build());
	// }

	public PFPCommand() {
		this.name = "pfp";
		this.help = "Sends an embed with the user's pfp along with a clickable link to it.";
		this.arguments = "<user>";
	}

	@Override
	protected void execute(CommandEvent e) {
		User user = e.getAuthor();
		if (!e.getMessage().getMentionedUsers().isEmpty())
			user = e.getMessage().getMentionedUsers().get(0);
		EmbedBuilder embed = EmbedUtils.embedImageWithTitle(String.format("%s's Profile Pic", user.getAsTag()),
				user.getEffectiveAvatarUrl(), user.getEffectiveAvatarUrl());
		e.reply(embed.build());
	}
}
