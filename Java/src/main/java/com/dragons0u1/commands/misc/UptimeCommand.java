package com.dragons0u1.commands.misc;

import static com.dragons0u1.utils.LanguageUtils.*;

import java.lang.management.*;

import com.dragons0u1.utils.*;
import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;

import net.dv8tion.jda.api.entities.*;

public class UptimeCommand extends Command {

	private class Uptime {
		private long seconds, minutes, hours, days;

		public Uptime(long seconds, long minutes, long hours, long days) {
			this.seconds = seconds;
			this.minutes = minutes;
			this.hours = hours;
			this.days = days;
		}

		public long getSeconds() {
			return seconds;
		}

		public long getMinutes() {
			return minutes;
		}

		public long getHours() {
			return hours;
		}

		public long getDays() {
			return days;
		}
	}

	private Uptime getUptime(long uptime) {
		long uptimeInSeconds = uptime / 1000, uptimeInHours = uptimeInSeconds / (60 * 60), uptimeInDays = uptimeInHours / 24,
				uptimeInMinutes = (uptimeInSeconds / 60) - (uptimeInHours * 60), 
				numberOfSeconds = uptimeInSeconds % 60;
				uptimeInHours %= 24;
				return new Uptime(numberOfSeconds, uptimeInMinutes, uptimeInHours, uptimeInDays);
	}

	// @Override
	// public void execute(SlashCommandContext ctx) {
	// 	JsonObject json;
	// 	if (ctx.getChannelType().equals(ChannelType.PRIVATE))
	// 		json = JsonParser.parseReader(LanguageUtils.getLanguageFile("en_US")).getAsJsonObject().getAsJsonObject("commands")
	// 				.getAsJsonObject("misc").getAsJsonObject("uptime");
	// 	else
	// 		json = getLanguage(ctx.getAuthor(), ctx.getGuild()).getAsJsonObject("commands")
	// 			.getAsJsonObject("misc").getAsJsonObject("uptime");
	// 	String message = json.get("message").getAsString();

	// 	RuntimeMXBean runtime = ManagementFactory.getRuntimeMXBean();
	// 	long uptimeLong = runtime.getUptime();
	// 	Uptime uptime = getUptime(uptimeLong);
	// 	ctx.reply(String.format(message, uptime.getDays(), uptime.getHours(), uptime.getMinutes(), uptime.getSeconds()));
	// }

	public UptimeCommand() {
		this.name = "uptime";
		this.help = "Gets the current runtime of the bot";
		this.aliases = new String[]{ "up" };
		this.guildOnly = false;
	}

	@Override
	protected void execute(CommandEvent e) {
		JsonObject json;
		if (e.getChannelType().equals(ChannelType.PRIVATE))
			json = JsonParser.parseReader(LanguageUtils.getLanguageFile("en_US")).getAsJsonObject().getAsJsonObject("commands")
					.getAsJsonObject("misc").getAsJsonObject("uptime");
		else
			json = getLanguage(e.getAuthor(), e.getGuild()).getAsJsonObject("commands")
				.getAsJsonObject("misc").getAsJsonObject("uptime");
		String message = json.get("message").getAsString();

		RuntimeMXBean runtime = ManagementFactory.getRuntimeMXBean();
		long uptimeLong = runtime.getUptime();
		Uptime uptime = getUptime(uptimeLong);
		e.reply(String.format(message, uptime.getDays(), uptime.getHours(), uptime.getMinutes(), uptime.getSeconds()));
	}
}
