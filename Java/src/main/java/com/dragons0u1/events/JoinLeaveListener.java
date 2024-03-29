package com.dragons0u1.events;

import static com.dragons0u1.utils.LanguageUtils.*;
import static com.dragons0u1.utils.StaticReferences.*;
import static com.dragons0u1.Main.*;
import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.*;

import java.awt.*;
import java.text.*;
import java.time.*;
import java.time.format.*;
import java.util.*;
import java.util.List;

import org.bson.*;

import com.google.gson.*;
import com.mongodb.client.*;

import me.duncte123.botcommons.messaging.*;
import net.dv8tion.jda.api.*;
import net.dv8tion.jda.api.audit.*;
import net.dv8tion.jda.api.entities.*;
import net.dv8tion.jda.api.events.guild.*;
import net.dv8tion.jda.api.events.guild.member.*;
import net.dv8tion.jda.api.hooks.*;

public class JoinLeaveListener extends ListenerAdapter {

	private ZoneId UTC = ZoneId.of(ZoneOffset.UTC.getId());

	@Override
	public void onGuildMemberJoin(GuildMemberJoinEvent e) {
		Document serverSettingsDoc = serverSettings.find(eq("guildId", e.getGuild().getId())).first(),
			adminDoc = admin.find(eq("guildId", e.getGuild().getId())).first();

		if (serverSettingsDoc == null) {
			serverSettingsDoc = new Document("guildId", e.getGuild().getId())
				.append("prefix", "m?").append("welcome", false).append("audits", false)
				.append("roledm", false).append("joinrole", false);
			serverSettings.insertOne(serverSettingsDoc);
		}
		if (!serverSettingsDoc.getBoolean("welcome") && !serverSettingsDoc.getBoolean("audits")) return;

		JsonObject json = JsonParser.parseReader(getLanguageFile(getGuildLanguage(e.getGuild()))).getAsJsonObject()
				.getAsJsonObject("general").getAsJsonObject("member_join");
		String title = json.get("title").getAsString(), description = json.get("description").getAsString(),
				joined_at = json.get("joined_at").getAsString(), created_at = json.get("created_at").getAsString(),
				young_acc = json.get("young_account_warn").getAsString();

		User user = e.getUser();
		LocalDateTime creationTime = user.getTimeCreated().atZoneSameInstant(UTC).toLocalDateTime();

		Date date = Date.from(Instant.now());
		DateFormat format = new SimpleDateFormat();
		format.setTimeZone(TimeZone.getTimeZone(UTC));
		boolean isBot = e.getUser().isBot();
		String emote = e.getJDA().getShardManager().getGuildById(HOMESERVERID).getEmoteById(BOTEMOTEID).getAsMention();

		if (serverSettingsDoc.getBoolean("audits")) {
			String auditChannel = adminDoc.getString("audits");
			EmbedBuilder embed = EmbedUtils
					.embedMessageWithTitle(
							String.format(title, user.getAsTag() + (isBot ? " " + emote : "")),
							description)
					.setThumbnail(user.getEffectiveAvatarUrl()).addField(joined_at, format.format(date), false)
					.addField(created_at, creationTime.format(DateTimeFormatter.ISO_DATE), false).setColor(Color.GREEN);
			if (creationTime.plusWeeks(2).isAfter(LocalDateTime.now(UTC)))
				embed.addField(young_acc, "", false);
			e.getGuild().getTextChannelById(auditChannel).sendMessageEmbeds(embed.build()).queue();
		}

		if (serverSettingsDoc.getBoolean("welcome")) {
			String welcomeChannel = adminDoc.getString("welcome");
			String welcomeMessage = adminDoc.getString("welcome_message");
			EmbedBuilder welcome = EmbedUtils
					.embedMessageWithTitle(String.format(title, user.getAsTag()), welcomeMessage)
					.setThumbnail(user.getEffectiveAvatarUrl()).setColor(Color.GREEN);
			e.getGuild().getTextChannelById(welcomeChannel).sendMessageEmbeds(welcome.build()).queue();
		}

		if (serverSettingsDoc.getBoolean("joinrole", false)) {
			MongoCollection<Document> joinrole = database.getCollection("joinrole");
			Role role = e.getGuild().getRoleById(joinrole.find(eq("guildid", e.getGuild().getIdLong()))
					.projection(include("role")).first().getString("role"));
			e.getGuild().addRoleToMember(e.getMember(), role).queue();
		}
	}

	@Override
	public void onGuildMemberRemove(GuildMemberRemoveEvent e) {
		Document serverSettingsDoc = serverSettings.find(eq("guildId", e.getGuild().getId())).first(),
			adminDoc = admin.find(eq("guildId", e.getGuild().getId())).first();

		if (!serverSettingsDoc.getBoolean("audits")) return;

		JsonObject json = JsonParser.parseReader(getLanguageFile(getGuildLanguage(e.getGuild()))).getAsJsonObject()
				.getAsJsonObject("general").getAsJsonObject("member_leave");
		String title = json.get("title").getAsString(), description = json.get("description").getAsString(),
				roles_at_time = json.get("roles").getAsString();

		User memberAsUser = e.getUser();
		boolean isBot = e.getUser().isBot();
		String emote = e.getJDA().getShardManager().getGuildById(HOMESERVERID).getEmoteById(BOTEMOTEID).getAsMention();

		String auditChannel = adminDoc.getString("audits");
		EmbedBuilder embed = EmbedUtils.embedMessageWithTitle(
				String.format(title, memberAsUser.getAsTag() + (isBot ? " " + emote : "")),
				description).setThumbnail(memberAsUser.getEffectiveAvatarUrl()).setColor(Color.MAGENTA);

		Member member = e.getMember();
		if (member != null) {
			List<Role> roles = member.getRoles();
			String rolesString = "";

			for (Role role : roles)
				rolesString += role.getAsMention() + " ";
			embed.addField(roles_at_time, rolesString, false);
		} else
			logger.info(
					"The member returned null. The API probably didn't cache them at the time. Roles weren't added.");

		e.getGuild().getTextChannelById(auditChannel).sendMessageEmbeds(embed.build()).queue();
	}

	@Override
	public void onGuildBan(GuildBanEvent e) {
		Document serverSettingsDoc = serverSettings.find(eq("guildId", e.getGuild().getId())).first(),
			adminDoc = admin.find(eq("guildId", e.getGuild().getId())).first();

		if (!serverSettingsDoc.getBoolean("audits")) return;

		JsonObject json = JsonParser.parseReader(getLanguageFile(getGuildLanguage(e.getGuild()))).getAsJsonObject()
				.getAsJsonObject("general").getAsJsonObject("member_ban");
		String title = json.get("title").getAsString();

		User user = e.getUser();
		e.getGuild().retrieveBan(user).queue((ban) -> {
			String auditChannel = adminDoc.getString("audits");
			EmbedBuilder embed = EmbedUtils
					.embedMessageWithTitle(String.format(title, user.getAsTag()), ban.getReason())
					.setThumbnail(user.getEffectiveAvatarUrl()).setColor(Color.RED);
			e.getGuild().getTextChannelById(auditChannel).sendMessageEmbeds(embed.build()).queue();
		});
	}

	@Override
	public void onGuildUnban(GuildUnbanEvent e) {
		Document serverSettingsDoc = serverSettings.find(eq("guildId", e.getGuild().getId())).first(),
			adminDoc = admin.find(eq("guildId", e.getGuild().getId())).first();

		if (!serverSettingsDoc.getBoolean("audits")) return;

		JsonObject json = JsonParser.parseReader(getLanguageFile(getGuildLanguage(e.getGuild()))).getAsJsonObject()
				.getAsJsonObject("general").getAsJsonObject("member_unban");
		String title = json.get("title").getAsString();

		User user = e.getUser();
		AuditLogEntry auditLog = e.getGuild().retrieveAuditLogs().type(ActionType.UNBAN).getLast();
		String auditChannel = adminDoc.getString("audits");
		EmbedBuilder embed = EmbedUtils.embedMessageWithTitle(String.format(title, user.getAsTag()), "")
				.setColor(Color.GREEN);
		if (auditLog != null)
			embed.setDescription(auditLog.getReason()).setThumbnail(user.getEffectiveAvatarUrl());
		e.getGuild().getTextChannelById(auditChannel).sendMessageEmbeds(embed.build()).queue();
	}
}
