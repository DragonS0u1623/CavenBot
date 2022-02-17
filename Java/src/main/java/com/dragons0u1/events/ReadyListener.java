package com.dragons0u1.events;

import static com.dragons0u1.utils.StaticReferences.*;

import net.dv8tion.jda.api.events.*;
import net.dv8tion.jda.api.hooks.*;

public class ReadyListener extends ListenerAdapter {
	@Override
	public void onReady(ReadyEvent e) {
		logger.debug(String.format("Logged in as %s on shard %s", e.getJDA().getSelfUser().getAsTag(),
				e.getJDA().getShardInfo().getShardId()));

	}

}
