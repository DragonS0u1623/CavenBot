package com.dragons0u1.commands.misc;

import static com.dragons0u1.utils.LanguageUtils.*;

import com.dragons0u1.utils.*;
import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;

import net.dv8tion.jda.api.entities.*;
import net.dv8tion.jda.api.sharding.*;

public class JoinedGuildsCommand extends Command {

	public JoinedGuildsCommand() {
		this.name = "guilds";
		this.help = "Gives the number of servers the bot is in";
		this.guildOnly = false;
	}

	@Override
	protected void execute(CommandEvent e) {
		JsonObject json;
		if (e.getChannelType().equals(ChannelType.PRIVATE))
			json = JsonParser.parseReader(LanguageUtils.getLanguageFile("en_US")).getAsJsonObject().getAsJsonObject("commands")
			.getAsJsonObject("misc").getAsJsonObject("joined_guilds");
		else
			json = getLanguage(e.getAuthor(), e.getGuild()).getAsJsonObject("commands")
				.getAsJsonObject("misc").getAsJsonObject("joined_guilds");
		String message = json.get("message").getAsString();
		ShardManager manager = e.getJDA().getShardManager();
		e.reply(String.format(message, manager.getGuilds().size()));
	}
}
