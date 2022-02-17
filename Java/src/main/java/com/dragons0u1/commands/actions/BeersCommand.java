package com.dragons0u1.commands.actions;

import static com.dragons0u1.utils.StaticReferences.*;
import static com.dragons0u1.utils.LanguageUtils.*;

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

public class BeersCommand extends Command {
	String TenorAPI = "https://api.tenor.com/v1/random?q=%s&key=%s&limit=1&media_filter=minimal";

	public BeersCommand() {
		this.name = "beers";
		this.help = "Sends an embed with a gif of cheers";
	}

	@Override
	protected void execute(CommandEvent ctx) {
		JsonObject action = getLanguage(ctx.getAuthor(), ctx.getGuild()).getAsJsonObject("commands").getAsJsonObject("actions");
		JsonObject error = getError(ctx.getAuthor(), ctx.getGuild()).getAsJsonObject("actions");
		String gifURL = "";
		try {
			URL url = new URL(String.format(TenorAPI, "cheers", Dotenv.load().get("TENORGIF_KEY")));
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
			title = action.getAsJsonObject("beers").get("title").getAsString();
			embed.setTitle(title);
		} else {
			title = action.getAsJsonObject("beers").get("title_mention").getAsString();
			embed.setTitle(String.format(title, TitleBuilder.prepareTitle(ctx.getMessage().getMentionedMembers())));
		}
		ctx.reply(embed.build());
	}

	// protected void execute(SlashCommandEvent ctx) {
	// 	JsonObject action = getLanguage(ctx.getUser(), ctx.getGuild()).getAsJsonObject("commands").getAsJsonObject("actions");
	// 	JsonObject error = getError(ctx.getUser(), ctx.getGuild()).getAsJsonObject("actions");
	// 	String gifURL = "";
	// 	try {
	// 		URL url = new URL(String.format(TenorAPI, "cheers", Dotenv.load().get("TENORGIF_KEY")));
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
	// 		title = action.getAsJsonObject("beers").get("title").getAsString();
	// 		embed.setTitle(title);
	// 	} else {
	// 		title = action.getAsJsonObject("beers").get("title_mention").getAsString();
	// 		embed.setTitle(String.format(title, TitleBuilder.prepareTitle(ctx.getOption("user"))));
	// 	}
	// 	ctx.replyEmbeds(embed.build());
	// }
}
