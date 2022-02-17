package com.dragons0u1.commands.misc;

import static com.dragons0u1.utils.LanguageUtils.*;

import java.util.*;

import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;


public class DiceCommand extends Command {

	// @Override
	// public void execute(SlashCommandContext ctx) {
	// 	JsonObject json = getLanguage(ctx.getAuthor(), ctx.getGuild()).getAsJsonObject("commands").getAsJsonObject("misc").getAsJsonObject("dice");
	// 	String message;
	// 	int sides = 6;
	// 	if (ctx.getOption("sides") != null) sides = (int) ctx.getOption("sides").getAsLong();
		
	// 	Random r = new Random();
	// 	int roll = r.nextInt(sides) + 1;
	// 	if (roll == 1) {
	// 		message = json.get("critical_fail").getAsString();
	// 		ctx.reply(String.format(message, ctx.getAuthor().getAsTag(), sides, roll));
	// 	} else if (roll == sides && sides == 20) {
	// 		message = json.get("nat_20").getAsString();
	// 		ctx.reply(String.format(message, ctx.getAuthor().getAsTag(), sides));
	// 	} else {
	// 		message = json.get("normal").getAsString();
	// 		ctx.reply(String.format(message, ctx.getAuthor().getAsTag(), sides, roll));
	// 	}
	// }

	public DiceCommand(){
		this.name = "dice";
		this.help = "Rolls a dice with the amount of sides given. Default is a normal 6-sided dice";
		this.arguments = "[sides]";
		this.aliases = new String[]{ "d" };
	}

	@Override
	protected void execute(CommandEvent e) {
		JsonObject json = getLanguage(e.getAuthor(), e.getGuild()).getAsJsonObject("commands").getAsJsonObject("misc").getAsJsonObject("dice");
		String message;
		int sides = 6;
		if (!String.join(" ", e.getArgs()).isBlank())
			sides = Integer.parseInt(e.getArgs().split(" ")[0]);
		Random r = new Random();
		int roll = r.nextInt(sides) + 1;
		if (roll == 1) {
			message = json.get("critical_fail").getAsString();
			e.reply(String.format(message, e.getAuthor().getAsTag(), sides, roll));
		} else if (roll == sides && sides == 20) {
			message = json.get("nat_20").getAsString();
			e.reply(String.format(message, e.getAuthor().getAsTag(), sides));
		} else {
			message = json.get("normal").getAsString();
			e.reply(String.format(message, e.getAuthor().getAsTag(), sides, roll));
		}
	}
}
