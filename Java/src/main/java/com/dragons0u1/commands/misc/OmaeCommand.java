package com.dragons0u1.commands.misc;

import java.awt.*;

import com.jagrosh.jdautilities.command.*;

import me.duncte123.botcommons.messaging.*;
import net.dv8tion.jda.api.*;

public class OmaeCommand extends Command {
	String gif1 = "https://cdn.discordapp.com/attachments/640674672618373132/647205970442846220/20191121_172359.jpg",
			gif2 = "https://cdn.discordapp.com/attachments/640674672618373132/711291888594059354/tenor-4.gif";

	// @Override
	// public void execute(SlashCommandContext ctx) {
	// 	EmbedBuilder embed = EmbedUtils.embedImageWithTitle("Omae wa mou shindeiru", gif1, gif1).setColor(Color.ORANGE);
	// 	ctx.getChannel().sendMessageEmbeds(embed.build()).queue();
	// 	embed = EmbedUtils.embedImageWithTitle("NANI!!!", gif2, gif2).setColor(Color.RED);
	// 	ctx.reply(embed.build());
	// }

	public OmaeCommand() {
		this.name = "omae";
		this.help = "Gives an anime joke";
	}

	@Override
	protected void execute(CommandEvent e) {
		EmbedBuilder embed = EmbedUtils.embedImageWithTitle("Omae wa mou shindeiru", gif1, gif1).setColor(Color.ORANGE);
		e.reply(embed.build());
		embed = EmbedUtils.embedImageWithTitle("NANI!!!", gif2, gif2).setColor(Color.RED);
		e.reply(embed.build());
	}

}
