package com.dragons0u1.utils;

import java.util.*;

import net.dv8tion.jda.api.entities.*;
import net.dv8tion.jda.api.interactions.commands.*;

public class TitleBuilder {

	public static String prepareTitle(List<Member> members) {
		String title = "";
		if (members.size() >= 1) {
			for (Member member : members) {
				if (members.size() == 1)
					title += member.getEffectiveName();
				else {
					if (members.indexOf(member) < members.size()-1)
						title += String.format("%s, ", member.getEffectiveName());
					else
						title += String.format("and %s", member.getEffectiveName());
				}
			}
		}
		return title;
	}

	public static String prepareTitle(OptionMapping option) {
		String title = "";
		Member member = option.getAsMember();
		if (member != null)
			title += member.getEffectiveName();
		return title;
	}
}
