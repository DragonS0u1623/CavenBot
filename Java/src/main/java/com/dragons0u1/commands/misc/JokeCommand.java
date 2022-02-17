package com.dragons0u1.commands.misc;

import static com.dragons0u1.utils.StaticReferences.*;

import java.io.*;
import java.net.*;

import com.google.gson.*;
import com.jagrosh.jdautilities.command.*;

public class JokeCommand extends Command {
	String api = "https://sv443.net/jokeapi/v2/joke/Any";

	// @Override
	// public void execute(SlashCommandContext e) {
	// 	String joke = "";
	// 	try {
	// 		URL url = new URL(api);
	// 		HttpURLConnection con = (HttpURLConnection) url.openConnection();
	// 		con.setRequestMethod("GET");
	// 		con.setRequestProperty("Accept", "application/json");
	// 		int responseCode = con.getResponseCode();
	// 		if (responseCode != HttpURLConnection.HTTP_ACCEPTED && responseCode != HttpURLConnection.HTTP_OK) {
	// 			logger.warn(
	// 					String.format("Response returned an error of %d: %s", responseCode, con.getResponseMessage()));
	// 			if (responseCode >= 500) {
	// 				e.reply("Sorry but an unexpected server error occured with the Joke API. Try again in a bit.");
	// 				return;
	// 			} else {
	// 				e.reply("Sorry. An API error occured while trying to find a joke.");
	// 				return;
	// 			}
	// 		}
	// 		BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
	// 		String line, response = "";
	// 		while ((line = in.readLine()) != null)
	// 			response += line;
	// 		in.close();
			
	// 		JsonObject json = JsonParser.parseString(response).getAsJsonObject();
	// 		if (json.get("type").getAsString().equals("single")) {
	// 			joke = json.get("joke").getAsString();
	// 		} else if (json.get("type").getAsString().equals("twopart")) {
	// 			String setup = json.get("setup").getAsString(), delivery = json.get("delivery").getAsString();
	// 			joke = String.format("%s\n%s", setup, delivery);
	// 		}
	// 		e.reply(joke);
	// 	} catch (Exception ex) {
	// 		e.reply("An error occurred trying to get a joke. Try again later.");
	// 		ex.printStackTrace();
	// 		return;
	// 	}
	// }

	public JokeCommand() {
		this.name = "joke";
		this.help = "Sends a random joke to the chat";
	}

	@Override
	protected void execute(CommandEvent e) {
		String joke = "";
		try {
			URL url = new URL(api);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");
			con.setRequestProperty("Accept", "application/json");
			int responseCode = con.getResponseCode();
			if (responseCode != HttpURLConnection.HTTP_ACCEPTED && responseCode != HttpURLConnection.HTTP_OK) {
				logger.warn(
						String.format("Response returned an error of %d: %s", responseCode, con.getResponseMessage()));
				if (responseCode >= 500) {
					e.reply("Sorry but an unexpected server error occured with the Joke API. Try again in a bit.");
					return;
				} else {
					e.reply("Sorry. An API error occured while trying to find a joke.");
					return;
				}
			}
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String line, response = "";
			while ((line = in.readLine()) != null)
				response += line;
			in.close();
			
			JsonObject json = JsonParser.parseString(response).getAsJsonObject();
			if (json.get("type").getAsString().equals("single")) {
				joke = json.get("joke").getAsString();
			} else if (json.get("type").getAsString().equals("twopart")) {
				String setup = json.get("setup").getAsString(), delivery = json.get("delivery").getAsString();
				joke = String.format("%s\n%s", setup, delivery);
			}
			e.reply(joke);
		} catch (Exception ex) {
			e.reply("An error occurred trying to get a joke. Try again later.");
			ex.printStackTrace();
			return;
		}
	}
}
