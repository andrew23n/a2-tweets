class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const text = this.text;
        if (text.startsWith("Just completed") || text.startsWith("Just posted") || text.startsWith("Completed a")) {
            return 'completed_event';
        }
        if (text.includes("#RKLive") || text.startsWith("Watch my") || text.includes("right now")) {
            return 'live_event';
        }
        if (text.startsWith("Achieved a new") || text.startsWith("I just set a goal")) {
            return 'achievement';
        }
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        return this.writtenText.length > 0;
    }

    get writtenText():string {
        if(this.source != 'completed_event') {
            return "";
        }
        
        let cleaned = this.text.replace(/#runkeep/gi, "");
        cleaned = this.text.replace(/https?:\/\/\S+/g, "");
        cleaned = this.text.replace(/\s+/g, " ");
        cleaned = this.text.trim();

        const match = cleaned.match();

        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}