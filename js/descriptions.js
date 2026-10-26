function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {return new Tweet(tweet.text, tweet.created_at);})
			.filter(function(tweet) {return tweet.written;}
	);
	document.getElementById('textFilter').dispatchEvent(new Event('input'));
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	const textFilter = document.getElementById('textFilter');
	const table = document.getElementById('tweetTable');

	textFilter.addEventListener('input', function() {
		const query = textFilter.value;
		const needle = query.toLowerCase();

		// when search is empty, everything else is empty
		if(needle==='') {
			table.innerHTML = '';
			document.getElementById('searchCount').innerText = 0;
			document.getElementById('searchText').innerText = '';
			return;
		}

		const writtenTweets = window.tweet_array || [];
		// searching mechanism
		const matches = writtenTweets.filter(function(tweet) {
			return tweet.writtenText.toLowerCase().includes(needle);
		});

		// update table
		table.innerHTML = matches.map(function(tweet, index) {
			return tweet.getHTMLTableRow(index + 1);
		}).join('');

		// update query text
		document.getElementById('searchCount').innerText = matches.length;
		document.getElementById('searchText').innerText = query;
	});

	textFilter.dispatchEvent(new Event('input'));
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});