package com.dragons0u1.utils;

import org.apache.logging.log4j.*;

import java.util.*;

import com.dragons0u1.*;

public class StaticReferences {
	public static final Logger logger = LogManager.getLogger(CavenBot.class);
	public static final List<String> OWNERS = Arrays.asList("163667745580253184", "465000885286600704");
	
	public static final String BOTID = "638446270469373972",
			AUTHORID = "163667745580253184",
			TENORAPI = "https://api.tenor.com/v1/random?q=%s&key=%s&limit=1&media_filter=minimal&contentfilter=medium&ar_range=standard",
			HOMESERVERID = "712065344264470548", BOTEMOTEID = "758736183974297630";

	public static final long ONE_MINUTE = 1000L * 60L, ONE_HOUR = 60L * ONE_MINUTE, ONE_DAY = 24L * ONE_HOUR, ONE_WEEK = 7 * ONE_DAY;
}
