package com.dragons0u1.commands.misc;

import static com.dragons0u1.utils.LanguageUtils.*;

import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;

import me.duncte123.botcommons.messaging.*;
import net.dv8tion.jda.api.*;

public class SupportServerCommand extends Command {
	String invite = "https://discord.gg/6TjuPYy";

	// @Override
	// public void execute(SlashCommandContext ctx) {
	// 	JsonObject json = getLanguage(ctx.getAuthor(), ctx.getGuild()).getAsJsonObject("commands")
	// 			.getAsJsonObject("misc").getAsJsonObject("support_server");
	// 	String message = json.get("message").getAsString();
	// 	EmbedBuilder embed = EmbedUtils.embedImageWithTitle(message, invite, ctx.getSelfUser().getEffectiveAvatarUrl());
	// 	ctx.replyInDm(embed.build());
	// }

	public SupportServerCommand() {
		this.name = "support";
		this.help = "Sends an embed with the invite link to the official support server";
		this.guildOnly = false;
	}

	@Override
	protected void execute(CommandEvent e) {
		JsonObject json = getLanguage(e.getAuthor(), e.getGuild()).getAsJsonObject("commands")
				.getAsJsonObject("misc").getAsJsonObject("support_server");
		String message = json.get("message").getAsString();
		EmbedBuilder embed = EmbedUtils.embedImageWithTitle(message, invite, e.getSelfUser().getEffectiveAvatarUrl());
		e.replyInDm(embed.build());
	}
}
