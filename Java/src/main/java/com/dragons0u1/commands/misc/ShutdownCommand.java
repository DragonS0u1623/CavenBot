package com.dragons0u1.commands.misc;

import static com.dragons0u1.Main.*;
import static com.dragons0u1.utils.StaticReferences.*;

import com.dragons0u1.*;
import com.jagrosh.jdautilities.command.*;

import me.duncte123.botcommons.*;
import me.duncte123.botcommons.text.*;

public class ShutdownCommand extends Command {

	public ShutdownCommand() {
		this.name = "shutdown";
		this.help = "Shuts down the bot. Can only be used by trusted users.";
		this.ownerCommand = true;
		this.guildOnly = false;
		this.hidden = true;
		this.aliases = new String[]{ "sd" };
	}

	@Override
	protected void execute(CommandEvent e) {
		CavenBot.shouldShutdown = true;

		e.reply(":warning: Shutting down");
		e.reactWarning();

		logger.info(TextColor.ORANGE + "Shutting down " + TextColor.GREEN + e.getSelfUser().getAsTag()
				+ TextColor.ORANGE + " now" + TextColor.RESET);
		BotCommons.shutdown(e.getJDA().getShardManager());
		mongoClient.close();
	}
}
