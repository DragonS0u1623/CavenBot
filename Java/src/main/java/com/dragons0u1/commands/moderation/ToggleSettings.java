package com.dragons0u1.commands.moderation;

import static com.dragons0u1.Main.*;
import static com.dragons0u1.utils.LanguageUtils.*;
import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;
import static com.mongodb.client.model.Updates.*;

import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;

import net.dv8tion.jda.api.*;

public class ToggleSettings extends Command {

	public ToggleSettings() {
		this.name = "settings";
		this.help = "Command to toggle on and off different settings for the bot.\nSettings to change:\n\t`Audits`\n\t`Welcome`";
		this.arguments = "<audits/welcome>";
	}

	@Override
	protected void execute(CommandEvent e) {
		JsonObject json = getLanguage(e.getGuild()).getAsJsonObject("commands").getAsJsonObject("moderation")
				.getAsJsonObject("toggle_settings");
		JsonObject error = getError(e.getGuild());
		String enable, disable;
		String[] args = e.getArgs().split(" ");
		
		if (!e.getMember().hasPermission(Permission.MANAGE_SERVER)) {
			String no_permission = error.get("no_permission").getAsString();
			e.reply(no_permission);
			return;
		}
		
		if (args.length == 0) {
			String no_args = error.getAsJsonObject("toggle_settings").get("no_args").getAsString();
			e.reply(no_args);
			return;
		}
		switch (args[0].toLowerCase()) {
		case "audits":
			boolean audits = serverSettings.find(eq("guildId", e.getGuild().getId())).projection(include("audits")).first().getBoolean("audits", false);
			serverSettings.findOneAndUpdate(eq("guildId", e.getGuild().getId()), set("audits", !audits));
			enable = json.get("audit_enable").getAsString();
			disable = json.get("audit_disable").getAsString();
			e.reply((!audits ? enable : disable));
			break;
		case "welcome":
			boolean welcome = serverSettings.find(eq("guildId", e.getGuild().getId())).projection(include("welcome")).first().getBoolean("welcome", false);
			serverSettings.findOneAndUpdate(eq("guildId", e.getGuild().getId()), set("welcome", !welcome));
			enable = json.get("welcome_enable").getAsString();
			disable = json.get("welcome_disable").getAsString();
			e.reply((!welcome ? enable : disable));
			break;
		default:
			String incorrect_arg = error.getAsJsonObject("toggle_settings").get("incorrect_arg").getAsString();
			e.reply(incorrect_arg);
			break;
		}
	}

}
