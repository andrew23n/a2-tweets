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
	const live = tweet_array.filter(function(tweet) { return tweet.source == 'completed_event'; }).length;
	const achievements = tweet_array.filter(function(tweet) { return tweet.source == 'achievements'; }).length;
	const miscellaneous = tweet_array.filter(function(tweet) { return tweet.source == 'miscellaneous'; }).length;
	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});