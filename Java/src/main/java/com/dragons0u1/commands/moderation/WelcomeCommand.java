package com.dragons0u1.commands.moderation;

import static com.dragons0u1.Main.*;
import static com.dragons0u1.utils.LanguageUtils.*;
import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;

import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;

import net.dv8tion.jda.api.*;
import net.dv8tion.jda.api.entities.*;

public class WelcomeCommand extends Command {

	public WelcomeCommand() {
		this.name = "welcome";
		this.help = "Sets the channel to send welcome messages";
		this.arguments = "<channel>";
	}

	@Override
	protected void execute(CommandEvent e) {
		JsonObject json = getLanguage(e.getGuild()).getAsJsonObject("commands").getAsJsonObject("moderation").getAsJsonObject("welcome");
		JsonObject error = getError(e.getGuild());
		String message = json.get("message").getAsString();

		if (!e.getMember().hasPermission(Permission.MANAGE_SERVER)) {
			String no_permission = error.get("no_permission").getAsString();
			e.reply(no_permission);
			return;
		}

		Message m = e.getMessage();

		if (e.getArgs().isBlank() || m.getMentionedChannels().isEmpty()) {
			String no_channel = error.get("no_channel").getAsString();
			e.reply(no_channel);
			return;
		}

		TextChannel t = m.getMentionedChannels().get(0);
		admin.findOneAndUpdate(eq("guildId", e.getGuild().getId()), set("welcome", t.getId()));
		e.reply(String.format(message, t.getAsMention()));
	}
}
