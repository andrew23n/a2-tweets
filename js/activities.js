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
	topThree.forEach(function(type) {
		meanByType[type] = mean(distanceData.filer(function(row) { return row.activity == type; }).map(function(row) { return row.distance;}));
	});
	const byLength = topThree.slice().sort(function(a,b) {return meanByType[b] - meanByType[a];});

	document.getElementById('longestActivityType').innerText = byLength[0];
	document.getElementById('shortestActivityType').innerText = byLength[byLength.length -1]

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});