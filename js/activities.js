function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const completed = tweet_array.filter(function(tweet) { return tweet.source == 'completed_event' && tweet.activityType != 'unknown'; });

	const counts = {};
	completed.forEach(function(tweet) {
		counts[tweet.activityType] = (counts[tweet.activityType] || 0) + 1;
	});

	const sortedTypes = Object.keys(counts).sort(function(a,b) { return counts[b] - counts[a];});
	const topThree = sortedTypes.slice(0,3);

	document.getElementById('numberActivities').innerText = sortedTypes.length;
	document.getElementById('firstMost').innerText = topThree[0];
	document.getElementById('secondMost').innerText = topThree[1];
	document.getElementById('thirdMost').innerText = topThree[2];
	
	const topThreeTweets = completed.filter(function(tweet) {
		return topThree.includes(tweet.activityType);
	});
	const distanceData = topThreeTweets.map(function(tweet) {
		return {activity: tweet.activityType, day: tweet.time.toLocaleDateString('en-US', {weekday: 'short' }), distance: tweet.distance };
	})

	const meanByType = {};

	function mean(values) {
		if (values.length === 0) {
			return 0;
		}
		return values.reduce(function(sum, value) {return sum + value;}, 0) / values.length;
	}
	topThree.forEach(function(type) {
		meanByType[type] = mean(distanceData.filter(function(row) { return row.activity == type; })
			.map(function(row) { return row.distance;}));
	});
	const byLength = topThree.slice().sort(function(a,b) {return meanByType[b] - meanByType[a];});

	document.getElementById('longestActivityType').innerText = byLength[0];
	document.getElementById('shortestActivityType').innerText = byLength[byLength.length -1];

	const isWeekend = function(row) {return row.day == 'Sat' || row.day == 'Sun';};
	const weekendMean = mean(distanceData.filter(isWeekend).map(function(row) {return row.distance;}));
	const weekDayMean = mean(distanceData.filter(function(row) {return !isWeekend(row);}).map(function(row) {return row.distance;}));

	document.getElementById('weekdayOrWeekendLonger').innerText = weekendMean > weekDayMean ? 'weekends' : 'weekdays';


	const activityCounts = sortedTypes.map(function(type) {
		return {activity: type, count: counts[type]};
	});
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityCounts
	  },
	  //TODO: Add mark and encoding
	  "mark": "bar",
	  "encoding": {
		"x": {"field": "activity", "type": "nominal", "sort": "-y", "title": "Activity type", "axis": {"labelAngle":-45}},
		"y":{"field":"count","type":"quantitative","title":"Number of Tweets"},
		"tooltip": [{"field":"activity", "title":"Activity"},{"field":"count","title":"Tweets"}]
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	
	const allRows = distanceData.map(function(row) {
		return { activity: row.activity, day: row.day, distance: row.distance, kind: 'all', opacity: 0.7, size: 30 };
	});
	const meanRows = [];
	topThree.forEach(function(type) {
		DAYS_OF_WEEK.forEach(function(day) {
			const distances = distanceData
				.filter(function(row) { return row.activity == type && row.day == day; })
				.map(function(row) { return row.distance; });
			if (distances.length > 0) {
				meanRows.push({ activity: type, day: day, distance: mean(distances), kind: 'mean', opacity: 1, size: 150 });
			}
		});
	});
	
	const xEncoding = {"field": "day", "type": "ordinal", "sort": DAYS_OF_WEEK, "title": "time (day)", "axis": {"grid": true}};
	const colorEncoding = {"field": "activity", "type": "nominal", "title": "Activity type"};
	// graph 2
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distance of each activity by day of the week.",
	  "data": {
	    "values": distanceData
	  },
	  "mark": "point",
	  "encoding": {
	    "x": xEncoding,
	    "y": {"field": "distance", "type": "quantitative", "title": "distance"},
	    "color": colorEncoding
	  }
	};
 
	// graph 3
	distance_vis_aggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distance of each activity type by day of the week.",
	  "data": {
	    "values": distanceData
	  },
	  "mark": "point",
	  "encoding": {
	    "x": xEncoding,
	    "y": {"aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Mean of distance"},
	    "color": colorEncoding
	  }
	};
 
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});
 
	// Alternate between the two plots when the button is pressed (start with all activities shown)
	const distanceDiv = document.getElementById('distanceVis');
	const aggregatedDiv = document.getElementById('distanceVisAggregated');
	const button = document.getElementById('aggregate');
	aggregatedDiv.style.display = 'none';
	button.addEventListener('click', function() {
		const showingMeans = aggregatedDiv.style.display !== 'none';
		distanceDiv.style.display = showingMeans ? '' : 'none';
		aggregatedDiv.style.display = showingMeans ? 'none' : '';
		button.innerText = showingMeans ? 'Show means' : 'Show all activities';
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});