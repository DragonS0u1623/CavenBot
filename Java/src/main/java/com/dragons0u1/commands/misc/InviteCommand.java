package com.dragons0u1.commands.misc;

import static com.dragons0u1.utils.LanguageUtils.*;

import java.awt.*;

import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;

import me.duncte123.botcommons.messaging.*;
import net.dv8tion.jda.api.*;

public class InviteCommand extends Command {
	String invite = "https://discord.com/api/oauth2/authorize?client_id=638446270469373972&permissions=1636151717110&scope=bot%20applications.commands";

	// @Override
	// public void execute(SlashCommandContext ctx) {
	// 	JsonObject json = getLanguage(ctx.getAuthor(), ctx.getGuild()).getAsJsonObject("general").getAsJsonObject("invite");
	// 	String title = json.get("title").getAsString();
	// 	EmbedBuilder embed = EmbedUtils.getDefaultEmbed().setTitle(title, invite)
	// 			.setColor(Color.BLUE).setThumbnail(ctx.getSelfUser().getEffectiveAvatarUrl());
	// 	ctx.replyInDm(embed.build());
	// }

	public InviteCommand() {
		this.name = "invite";
		this.help = "Sends the user an embed with an invite link. Please add me to all your favourite servers.";
		this.guildOnly = false;
	}

	@Override
	protected void execute(CommandEvent e) {
		JsonObject json = getLanguage(e.getAuthor(), e.getGuild()).getAsJsonObject("general").getAsJsonObject("invite");
		String title = json.get("title").getAsString();
		EmbedBuilder embed = EmbedUtils.getDefaultEmbed().setTitle(title, invite)
				.setColor(Color.BLUE).setThumbnail(e.getSelfUser().getEffectiveAvatarUrl());
		e.replyInDm(embed.build());
	}
}
