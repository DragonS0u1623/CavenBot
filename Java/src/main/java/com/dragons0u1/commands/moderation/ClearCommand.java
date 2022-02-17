package com.dragons0u1.commands.moderation;

import static com.dragons0u1.utils.StaticReferences.*;
import static com.dragons0u1.utils.LanguageUtils.*;

import java.util.*;

import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;

import net.dv8tion.jda.api.*;
import net.dv8tion.jda.api.entities.*;

public class ClearCommand extends Command {

	public ClearCommand() {
		this.name = "clear";
		this.help = "Clears the specified amount of messages from the channel. Default is 5";
		this.arguments = "<amount>";
	}

	@Override
	protected void execute(CommandEvent e) {
		JsonObject error = getError(e.getAuthor(), e.getGuild());
		if (!e.getMember().hasPermission(Permission.MESSAGE_MANAGE)) {
			String no_permission = error.get("no_permission").getAsString();
			e.reply(no_permission);
			return;
		}
		
		if (!e.getSelfMember().hasPermission(Permission.MESSAGE_MANAGE)) {
			String missing_permission = error.get("missing_permission").getAsString();
			e.reply(String.format(missing_permission, Permission.MESSAGE_MANAGE.getName()));
			return;
		}
		
		MessageChannel channel = e.getChannel();
		final List<Message> messages = new ArrayList<>();
		messages.add(e.getMessage());
		int limit = 5;

		String[] args = e.getArgs().split(" ");

		if (args.length != 0)
			try {
				limit = Integer.parseInt(args[0]);
			} catch (Exception ex) { }
		channel.getHistoryBefore(e.getMessage(), limit).queue(history -> {
			for (Message m : history.getRetrievedHistory())
				if (!m.isPinned())
					messages.add(m);
			channel.purgeMessages(messages);
		});
		logger.info(String.format("Deleted %s messages from %s", messages.size(), channel.getName()));
	}
}
