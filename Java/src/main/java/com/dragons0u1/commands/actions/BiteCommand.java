package com.dragons0u1.commands.actions;

import static com.dragons0u1.utils.LanguageUtils.*;
import static com.dragons0u1.utils.StaticReferences.*;

import java.awt.*;
import java.io.*;
import java.net.*;

import com.dragons0u1.utils.*;
import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;
import com.jagrosh.jdautilities.command.Command;

import io.github.cdimascio.dotenv.*;
import me.duncte123.botcommons.messaging.*;
import net.dv8tion.jda.api.*;

public class BiteCommand extends Command {

	// @Override
	// public void execute(SlashCommandContext ctx) {
	// 	JsonObject action = getLanguage(ctx.getAuthor(), ctx.getGuild()).getAsJsonObject("commands").getAsJsonObject("actions");
	// 	JsonObject error = getError(ctx.getAuthor(), ctx.getGuild()).getAsJsonObject("actions");
		
	// 	String gifURL = "";
	// 	try {
	// 		URL url = new URL(String.format(TENORAPI, "anime%20bite", Dotenv.load().get("TENORGIF_KEY")));
	// 		HttpURLConnection con = (HttpURLConnection) url.openConnection();
	// 		con.setRequestMethod("GET");
	// 		con.setRequestProperty("Accept", "application/json");
	// 		int responseCode = con.getResponseCode();
	// 		if (responseCode != HttpURLConnection.HTTP_ACCEPTED && responseCode != HttpURLConnection.HTTP_OK) {
	// 			logger.warn(
	// 					String.format("Response returned an error of %d: %s", responseCode, con.getResponseMessage()));
	// 			if (responseCode >= 500) {
	// 				String message = error.get("io_500").getAsString();
	// 				ctx.reply(message);
	// 				return;
	// 			} else {
	// 				String message = error.get("io_general").getAsString();
	// 				ctx.reply(message);
	// 				return;
	// 			}
	// 		}
	// 		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
	// 		String line, response = "";
	// 		while ((line = in.readLine()) != null)
	// 			response += line;
	// 		in.close();

	// 		JsonObject json = JsonParser.parseString(response).getAsJsonObject();
	// 		json = json.getAsJsonArray("results").get(0).getAsJsonObject();
	// 		json = json.getAsJsonArray("media").get(0).getAsJsonObject();
	// 		gifURL = json.getAsJsonObject("gif").get("url").getAsString();
	// 	} catch (IOException ex) {
	// 		String message = error.get("io").getAsString();
	// 		ctx.reply(message);
	// 		return;
	// 	}
	// 	String title, description = action.get("description").getAsString();

	// 	EmbedBuilder embed = EmbedUtils.embedImage(gifURL).setDescription(String.format(description, gifURL))
	// 			.setColor(Color.BLACK);
	// 	if (ctx.getOptions().size() == 0) {
	// 		title = action.getAsJsonObject("bite").get("title").getAsString();
	// 		embed.setTitle(String.format(title, ctx.getMember().getEffectiveName()));
	// 	} else {
	// 		title = action.getAsJsonObject("bite").get("title_mention").getAsString();
	// 		embed.setTitle(String.format(title, ctx.getMember().getEffectiveName(),
	// 				TitleBuilder.prepareTitle(ctx.getOption("user"))));
	// 	}
	// 	ctx.reply(embed.build());
	// }

	public BiteCommand() {
		this.name = "bite";
		this.help = "Sends a random gif of someone being bitten";
	}

	@Override
	protected void execute(CommandEvent ctx) {
		JsonObject action = getLanguage(ctx.getAuthor(), ctx.getGuild()).getAsJsonObject("commands").getAsJsonObject("actions");
		JsonObject error = getError(ctx.getAuthor(), ctx.getGuild()).getAsJsonObject("actions");
		
		String gifURL = "";
		try {
			URL url = new URL(String.format(TENORAPI, "anime%20bite", Dotenv.load().get("TENORGIF_KEY")));
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("Accept", "application/json");
			int responseCode = con.getResponseCode();
			if (responseCode != HttpURLConnection.HTTP_ACCEPTED && responseCode != HttpURLConnection.HTTP_OK) {
				logger.warn(
						String.format("Response returned an error of %d: %s", responseCode, con.getResponseMessage()));
				if (responseCode >= 500) {
					String message = error.get("io_500").getAsString();
					ctx.reply(message);
					return;
				} else {
					String message = error.get("io_general").getAsString();
					ctx.reply(message);
					return;
				}
			}
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String line, response = "";
			while ((line = in.readLine()) != null)
				response += line;
			in.close();

			JsonObject json = JsonParser.parseString(response).getAsJsonObject();
			json = json.getAsJsonArray("results").get(0).getAsJsonObject();
			json = json.getAsJsonArray("media").get(0).getAsJsonObject();
			gifURL = json.getAsJsonObject("gif").get("url").getAsString();
		} catch (IOException ex) {
			String message = error.get("io").getAsString();
			ctx.reply(message);
			return;
		}
		String title, description = action.get("description").getAsString();

		EmbedBuilder embed = EmbedUtils.embedImage(gifURL).setDescription(String.format(description, gifURL))
				.setColor(Color.BLACK);
		if (ctx.getArgs().isBlank() || ctx.getMessage().getMentionedUsers().isEmpty()) {
			title = action.getAsJsonObject("bite").get("title").getAsString();
			embed.setTitle(String.format(title, ctx.getMember().getEffectiveName()));
		} else {
			title = action.getAsJsonObject("bite").get("title_mention").getAsString();
			embed.setTitle(String.format(title, ctx.getMember().getEffectiveName(),
					TitleBuilder.prepareTitle(ctx.getMessage().getMentionedMembers())));
		}
		ctx.reply(embed.build());
	}
}
