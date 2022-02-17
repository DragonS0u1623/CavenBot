package com.dragons0u1;

import static com.dragons0u1.utils.StaticReferences.*;
import static me.duncte123.botcommons.text.TextColor.*;

import java.time.*;

import javax.security.auth.login.*;

import com.dragons0u1.commands.actions.*;
import com.dragons0u1.commands.misc.*;
import com.dragons0u1.commands.moderation.*;
import com.dragons0u1.events.*;
import com.jagrosh.jdautilities.command.*;

import io.github.cdimascio.dotenv.*;
import me.duncte123.botcommons.messaging.*;
import net.dv8tion.jda.api.*;
import net.dv8tion.jda.api.requests.*;
import net.dv8tion.jda.api.sharding.*;
import net.dv8tion.jda.api.utils.*;

public class CavenBot {
	private static CavenBot instance;
	private final ShardManager shardManager;
	public static boolean shouldShutdown = false;
	public CommandClientBuilder builder = new CommandClientBuilder();

	private CavenBot() throws LoginException {
		instance = this;
		Dotenv env = Dotenv.load();

		DefaultShardManagerBuilder shardBuilder = DefaultShardManagerBuilder.createDefault(env.get("TOKEN"))
				.enableIntents(GatewayIntent.GUILD_MEMBERS).setChunkingFilter(ChunkingFilter.ALL)
				.setBulkDeleteSplittingEnabled(false).setMemberCachePolicy(MemberCachePolicy.ALL).setShardsTotal(-1)
				.setAutoReconnect(true);
		shardManager = shardBuilder.build();

		EmbedUtils.setEmbedBuilder(() -> new EmbedBuilder().setFooter("Bot developed by Teddy Bear Inc\u2122#1525",
				"https://cdn.discordapp.com/avatars/163667745580253184/8e0242d26428b9a938fb813dc4aa608a.png")
				.setTimestamp(Instant.now()));
		
		builder.setOwnerId(AUTHORID);
		builder.setAlternativePrefix("m?");
		builder.useHelpBuilder(false);
		builder.setDiscordBotsKey(env.get("DBOTS_KEY"));
		builder.setShutdownAutomatically(true);

		loadCommands();

		// ********************************* LISTENERS
		// ********************************************************
		logger.info("Loading " + YELLOW + "Listeners" + RESET + "...");
		shardManager.addEventListener(new JoinLeaveListener(), new ReadyListener(), builder.build());
		logger.info(YELLOW + "Listeners" + RESET + " loaded...");
		logger.info("Logged in as " + GREEN + shardManager.getShardById(0).getSelfUser().getAsTag());
	}

	public static CavenBot getInstance() {
		if (instance == null)
			try {
				instance = new CavenBot();
			} catch (LoginException e) {
				logger.error(RED + "Error logging in." + RESET);
				e.printStackTrace();
			}
		return instance;
	}

	public void loadCommands() {
		builder.addCommands(
				// ***************************** Actions **************************************
				new BeersCommand(), new BegCommand(), new BiteCommand(), new CakeCommand(), new CookieCommand(),
				new CuddleCommand(), new GifCommand(), new GlareCommand(), new HighFiveCommand(), new HugCommand(),
				new KissCommand(), new LickCommand(), new MuffinButtonCommand(), new PatCommand(), new PokeCommand(),
				new PunchCommand(), new SassCommand(), new ShankCommand(), new SlapCommand(),

				// ******************************* Misc ***************************************
				new BotPFPCommand(), new DefineCommand(), new DiceCommand(), new GeneralKenobiCommand(),
				new HelloThereCommand(),
				new InviteCommand(), new JoinedGuildsCommand(), new JokeCommand(), new MemeCommand(), new NaniCommand(),
				new OmaeCommand(), new PFPCommand(), new ShutdownCommand(),
				new SupportServerCommand(),
				new UptimeCommand(),

				// **************************** Moderation ************************************
				new AuditCommand(), new BanCommand(), new ClearCommand(), new EditWelcomeCommand(), new KickCommand(),
				new ServerInfoCommand(), new SetLanguageCommand(), new ToggleSettings(), new UnbanCommand(),
				new WarnCommand(),
				new WelcomeCommand()

		);
	}

	public ShardManager getShardManager() {
		return shardManager;
	}

	public boolean isShutdown() {
		return shouldShutdown;
	}
}
