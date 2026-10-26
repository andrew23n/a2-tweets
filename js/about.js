function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	// dates
	const dateFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	const times = tweet_array.map(function(tweet) {return tweet.time.getTime(); });
	const earliest = new Date(Math.min(...times));
	const latest = new Date(Math.max(...times));

	document.getElementById('firstDate').innerText = earliest.toLocaleDateString('en-US', dateFormat);
	document.getElementById('lastDate').innerText = latest.toLocaleDateString('en-US', dateFormat);

	// categories
	const total = tweet_array.length;
	const completed = tweet_array.filter(function(tweet) {return tweet.source == 'completed_event'; }).length;
	const live = tweet_array.filter(function(tweet) { return tweet.source == 'live_event'; }).length;
	const achievements = tweet_array.filter(function(tweet) { return tweet.source == 'achievement'; }).length;
	const miscellaneous = tweet_array.filter(function(tweet) { return tweet.source == 'miscellaneous'; }).length;

	document.querySelectorAll(".completedEvents").forEach(function(element) { element.innerText = completed; });
	document.querySelectorAll(".liveEvents").forEach(function(element) { element.innerText = live; });
	document.querySelectorAll(".achievements").forEach(function(element) { element.innerText = achievements; });
	document.querySelectorAll(".miscellaneous").forEach(function(element) { element.innerText = miscellaneous; });

	document.querySelectorAll(".completedEventsPct").forEach(function(element) { element.innerText = math.format((completed / total) * 100, {notation: 'fixed', precision: 2}) + '%'; });
	document.querySelectorAll(".liveEventsPct").forEach(function(element) { element.innerText = math.format((live / total) * 100, {notation: 'fixed', precision: 2}) + '%'; });
	document.querySelectorAll(".achievementsPct").forEach(function(element) { element.innerText = math.format((achievements / total) * 100, {notation: 'fixed', precision: 2}) + '%'; });
	document.querySelectorAll(".miscellaneousPct").forEach(function(element) { element.innerText = math.format((miscellaneous / total) * 100, {notation: 'fixed', precision: 2}) + '%'; });

	const written = tweet_array.filter(function(tweet) { return tweet.source == 'completed_event' && tweet.written; }).length;
	document.querySelectorAll(".written").forEach(function(element) { element.innerText = written; });
	document.querySelectorAll(".writtenPct").forEach(function(element) { element.innerText = math.format((written / total) * 100, {notation: 'fixed', precision: 2}) + '%'; });
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});