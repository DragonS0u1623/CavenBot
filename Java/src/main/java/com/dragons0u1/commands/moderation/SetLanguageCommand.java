package com.dragons0u1.commands.moderation;

import static com.dragons0u1.utils.LanguageUtils.*;

import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;

public class SetLanguageCommand extends Command {

	public SetLanguageCommand() {
		this.name = "language";
		this.help = "Sets the language for either the user or the guild.\nValid languages are:\n" + getLanguages();
		this.children = new Command[]{ new GuildLanguageCommand(), new UserLanguageCommand() };
	}

	@Override
	protected void execute(CommandEvent e) {
		JsonObject json = getError(e.getAuthor(), e.getGuild());
		String no_child = json.get("no_child").getAsString();
		e.reply(String.format(no_child, "language"));
	}
}
