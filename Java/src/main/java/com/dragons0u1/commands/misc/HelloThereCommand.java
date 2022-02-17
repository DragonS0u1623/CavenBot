package com.dragons0u1.commands.misc;

import java.awt.*;

import com.jagrosh.jdautilities.command.*;

import me.duncte123.botcommons.messaging.*;
import net.dv8tion.jda.api.*;

public class HelloThereCommand extends Command {
	String gif = "https://cdn.discordapp.com/attachments/716088303622946846/737578683203584030/Hello_There.gif";

	// @Override
	// public void execute(SlashCommandContext ctx) {
	// 	EmbedBuilder embed = EmbedUtils.embedImageWithTitle("Hello There", gif, gif).setColor(Color.BLACK);
	// 	ctx.reply(embed.build());
	// }

	public HelloThereCommand() {
		this.name = "hello_there";
		this.help = "Sends an embed with a Star Wars gif on it";
		this.aliases = new String[]{ "hello", "hello there" };
	}

	@Override
	protected void execute(CommandEvent e) {
		EmbedBuilder embed = EmbedUtils.embedImageWithTitle("Hello There", gif, gif).setColor(Color.BLACK);
		e.reply(embed.build());
	}
}
