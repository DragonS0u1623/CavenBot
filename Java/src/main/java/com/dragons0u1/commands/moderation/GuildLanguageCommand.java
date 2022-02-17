package com.dragons0u1.commands.moderation;

import static com.dragons0u1.Main.*;
import static com.dragons0u1.utils.LanguageUtils.*;
import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Updates.*;

import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;

import net.dv8tion.jda.api.*;

public class GuildLanguageCommand extends Command {

	public GuildLanguageCommand() {
		this.name = "guild";
		this.help = "Sets the language for the guild.\nValid languages are:\n" + getLanguages();
		this.arguments = "<lang>";
	}

	@Override
	protected void execute(CommandEvent e) {
		JsonObject json = getLanguage(e.getGuild()).getAsJsonObject("general").getAsJsonObject("language");
		JsonObject error = getError(e.getAuthor(), e.getGuild());
		String no_args = json.get("no_args").getAsString();

		if (!e.getMember().hasPermission(Permission.MANAGE_SERVER)) {
			String no_permission = error.get("no_permission").getAsString();
			e.reply(no_permission);
			return;
		}
		String[] args = e.getArgs().split(" ");

		if (e.getArgs().isBlank() || !isValidLang(args[0])) {
			e.reply(no_args);
			return;
		}

		serverSettings.findOneAndUpdate(eq("guildid", e.getGuild().getId()), set("language", e.getArgs()));
		json = JsonParser.parseReader(getLanguageFile(args[0])).getAsJsonObject().getAsJsonObject("general").getAsJsonObject("language");
		String message = json.get("guild_message").getAsString();
		e.reply(String.format(message, args[0]));
	}

}
