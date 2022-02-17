package com.dragons0u1.commands.actions;

import java.awt.*;

import com.jagrosh.jdautilities.command.*;

import me.duncte123.botcommons.messaging.*;
import net.dv8tion.jda.api.*;

public class MuffinButtonCommand extends Command {

	// @Override
	// public void execute(SlashCommandContext e) {
	// 	String gif = "https://cdn.discordapp.com/attachments/716088303622946846/746103226008600657/muffin_button.gif";
	// 	EmbedBuilder embed = EmbedUtils.embedImageWithTitle("Muffin Button", gif, gif).setColor(Color.black);
	// 	e.reply(embed.build());
	// }

	public MuffinButtonCommand() {
		this.name = "muffin_button";
		this.help = "Sends a DBZA meme of the muffin button";
		this.aliases = new String[]{ "mb" };
	}

	@Override
	protected void execute(CommandEvent e) {
		String gif = "https://cdn.discordapp.com/attachments/716088303622946846/746103226008600657/muffin_button.gif";
		EmbedBuilder embed = EmbedUtils.embedImageWithTitle("Muffin Button", gif, gif).setColor(Color.black);
		e.reply(embed.build());
	}
}
