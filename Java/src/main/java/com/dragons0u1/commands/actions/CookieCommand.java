package com.dragons0u1.commands.actions;

import static com.dragons0u1.utils.LanguageUtils.*;

import java.awt.*;

import com.dragons0u1.utils.*;
import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;
import com.jagrosh.jdautilities.command.Command;

import me.duncte123.botcommons.messaging.*;
import net.dv8tion.jda.api.*;

public class CookieCommand extends Command {

	public CookieCommand() {
		this.name = "cookie";
		this.help = "Gives a cookie to someone";
	}

	@Override
	protected void execute(CommandEvent e) {
		JsonObject action = getLanguage(e.getAuthor(), e.getGuild()).getAsJsonObject("commands").getAsJsonObject("actions");
		
		String cookie = "https://cdn.discordapp.com/emojis/709783068881190932.png?v=1", title, description = action.get("description").getAsString();
		EmbedBuilder embed = EmbedUtils.embedImage(cookie).setDescription(String.format(description, cookie))
				.setColor(Color.BLACK);
		if (e.getArgs().isBlank() || e.getMessage().getMentionedUsers().isEmpty()) {
			title = action.getAsJsonObject("cookie").get("title").getAsString();
			embed.setTitle(String.format(title, e.getMember().getEffectiveName()));
		} else {
			title = action.getAsJsonObject("cookie").get("title_mention").getAsString();
			embed.setTitle(String.format(title, e.getMember().getEffectiveName(),
					TitleBuilder.prepareTitle(e.getMessage().getMentionedMembers())));
		}
		e.reply(embed.build());
	}

	// @Override
	// public void execute(SlashCommandContext e) {
	// 	JsonObject action = getLanguage(e.getAuthor(), e.getGuild()).getAsJsonObject("commands").getAsJsonObject("actions");
		
	// 	String cookie = "https://cdn.discordapp.com/emojis/709783068881190932.png?v=1", title, description = action.get("description").getAsString();
	// 	EmbedBuilder embed = EmbedUtils.embedImage(cookie).setDescription(String.format(description, cookie))
	// 			.setColor(Color.BLACK);
	// 	if (e.getOptions().size() == 0) {
	// 		title = action.getAsJsonObject("cookie").get("title").getAsString();
	// 		embed.setTitle(String.format(title, e.getMember().getEffectiveName()));
	// 	} else {
	// 		title = action.getAsJsonObject("cookie").get("title_mention").getAsString();
	// 		embed.setTitle(String.format(title, e.getMember().getEffectiveName(),
	// 				TitleBuilder.prepareTitle(e.getOption("user"))));
	// 	}
	// 	e.reply(embed.build());
	// }
}
