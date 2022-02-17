package com.dragons0u1.commands.misc;

import java.awt.*;

import com.jagrosh.jdautilities.command.*;

import me.duncte123.botcommons.messaging.*;
import net.dv8tion.jda.api.*;

public class NaniCommand extends Command {
	String gif = "https://cdn.discordapp.com/attachments/640674672618373132/711291888594059354/tenor-4.gif";

	// @Override
	// public void execute(SlashCommandContext ctx) {
	// 	EmbedBuilder embed = EmbedUtils.embedImageWithTitle("NANI!!!", gif, gif).setColor(Color.RED);
	// 	ctx.reply(embed.build());
	// }

	public NaniCommand() {
		this.name = "nani";
		this.help = "Sends an anime joke response";
	}

	@Override
	protected void execute(CommandEvent e) {
		EmbedBuilder embed = EmbedUtils.embedImageWithTitle("NANI!!!", gif, gif).setColor(Color.RED);
		e.reply(embed.build());
	}

}
