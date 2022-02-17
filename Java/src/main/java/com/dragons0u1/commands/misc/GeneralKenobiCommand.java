package com.dragons0u1.commands.misc;

import java.awt.*;

import com.jagrosh.jdautilities.command.*;

import me.duncte123.botcommons.messaging.*;
import net.dv8tion.jda.api.*;

public class GeneralKenobiCommand extends Command {
	String gif = "https://cdn.discordapp.com/attachments/716088303622946846/737578915236937768/general_Grievous.gif";

	// @Override
	// public void execute(SlashCommandContext ctx) {
	// 	EmbedBuilder embed = EmbedUtils.embedImageWithTitle("General Kenobi", gif, gif).setColor(Color.BLACK);
	// 	ctx.reply(embed.build());
	// }

	public GeneralKenobiCommand() {
		this.name = "general_kenobi";
		this.help = "Sends a gif from Star Wars";
		this.aliases = new String[]{ "gk", "general", "kenobi", "general kenobi" };
	}

	@Override
	protected void execute(CommandEvent e) {
		EmbedBuilder embed = EmbedUtils.embedImageWithTitle("General Kenobi", gif, gif).setColor(Color.BLACK);
		e.reply(embed.build());
	}

}