
function init () {
	blogposts("blogposts", "http://natasha.saxberg.dk/feed/atom/?tag=twitter");
	mosaic('http://api.flickr.com/services/feeds/photos_public.gne?id=91043280@N00&tags=twitterbogen&format=rss2');
	// are we framed?
	try {
		if (top.location.href !== window.location.href) {
			jQuery('#rightbar').hide();
		}
	} catch (e) {}
	links();
	mentions();
	// Facebook
	jQuery('#fbFan').append('<fb:fan profile_id="152058101038" name="Twitterbogen" stream="0" connections="0" width="190" height="59" css="http://twitterbogen.dk/css/facebook.css"></fb:fan>');
	FB.init("1962e4f7284820f243dd73f5c563b951");
}

function links () {
	var numEntries = 25;
	var feed = 'http://feeds.delicious.com/v2/json/tag/twitterbogen';
	jQuery.getJSON(feed+'?count='+numEntries+'&callback=?', function (data) {
		var buffer = '';
		for (var i = 0; i < data.length; i++) {
			var entry = data[i];
			buffer = buffer + '<li><a href="'+entry.u+'">'+entry.d+'</a></li>';
		}
		buffer = buffer + '<li><em><a href="http://delicious.com/tag/twitterbogen">flere</a></em></li>';
		jQuery('#links').append(buffer);
	});
}

function mentions () {
	var numEntries = 60;
	var feed = 'http://search.twitter.com/search.json?q=twitterbogen+OR+%23twitterbogen';
	jQuery.getJSON(feed + '&rpp='+numEntries+'&callback=?', function (data) {
		var buffer = '';
		for (var i = 0; i < data.results.length; i++) {
			var entry = data.results[i];
			buffer = buffer + '<li>';
			buffer = buffer + '<a href="http://twitter.com/'+entry.from_user+'" class="strong">'+entry.from_user+'</a> ';
			buffer = buffer + tweet.mash(entry.text);
			buffer = buffer + ' <em class="quiet">'+tweet.relativeTime(entry.created_at)+'</em>';
			buffer = buffer + '</li>';
		}
		buffer = buffer + '<li><em><a href="http://search.twitter.com/search?tag=twitterbogen">flere</a></em></li>';
		jQuery('#mentions').append(buffer);
	});
}

function fresh (tv, days) {
	var parsed_date = Date.parse(tv);
	var relative_to = new Date();
	var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
	return (delta < (days * 24 * 60 * 60));
}

function blogposts ($id, $feed) {
	var feed = new google.feeds.Feed($feed);
	feed.setNumEntries(5);
	feed.load(function(result) {
		if (!result.error) {
			jQuery('#blogsLoading').hide();
			for (var i = 0; i < result.feed.entries.length; i++) {
				var entry = result.feed.entries[i];
				var author = entry.author;
				var post = '';
				post += '<h2><a href="'+entry.link+'">'+entry.title+'</a></h2>';
				post += '<p>';
				post += 'Af <a href="'+result.feed.link+'">'+author+'</a>';
				if (fresh(entry.publishedDate, 30)) {
					post += '<span class="quiet">'+tweet.relativeTime(entry.publishedDate)+'</span>';
				}
				post += '</p>';
				post += entry.content;
				jQuery('#' + $id).append(post);
			}
		}
	});
}

function mosaic (url) {
	var feed = new google.feeds.Feed(url);
	var rows = 2;
	var row = 8;
	var numEntries = rows * row;
	feed.setNumEntries(numEntries);
	feed.load(function(result) {
		if (!result.error) {
			jQuery('#blogsLoading').hide();
			for (var i = 1; i <= result.feed.entries.length; i++) {
				var entry = result.feed.entries[i - 1];
				var classLast = (i == 8 || i == 16 || i == 24) ? 'last' : '';
				var classMarginTop = (i > row) ? 'margintop' : '';
				var image = entry.mediaGroups[0].contents[0].thumbnails[0].url;
				if (image) {
					jQuery('#slideshow').append('<div class="column '+classLast+' '+classMarginTop+'"><a href="'+entry.link+'"><img src="'+image+'" alt="" title="'+entry.title+'" class="thumbnail" /></a></div>');
				}				
			}
		}
	});	
}

/*
	Inspired by http://tweet.seaofclouds.com
	License: http://www.opensource.org/licenses/mit-license.php
*/
var tweet = {
	mash: function (txt) {
		return this.linkHash(this.linkUser(this.linkUrl(txt)));
	},
	linkUrl: function (txt) {
		var regexp = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
		return txt.replace(regexp,"<a href=\"$1\">$1</a>");
	},
	linkUser: function (txt) {
		var regexp = /[\@]+([A-Za-z0-9-_]+)/gi;
		return txt.replace(regexp,"<a href=\"http://twitter.com/$1\">@$1</a>");
	},
	linkHash: function (txt) {
		var regexp = /(?:^| )[\#]+([A-Za-z0-9-_]+)/gi;
		return txt.replace(regexp, ' <a href="http://search.twitter.com/search?tag=$1">#$1</a>');
	},
	relativeTime: function (tv) {
		var parsed_date = Date.parse(tv);
		var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
		var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
		if (delta < 60) {
			return 'less than a minute ago';
		} else if (delta < 120) {
			return 'about a minute ago';
		} else if (delta < (45*60)) {
			return (parseInt(delta / 60)).toString() + ' minutes ago';
		} else if (delta < (90*60)) {
			return 'about an hour ago';
		} else if (delta < (24*60*60)) {
			return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
		} else if (delta < (48*60*60)) {
			return '1 day ago';
		} else {
			return (parseInt(delta / 86400)).toString() + ' days ago';
		}
	}	
}

/* The End */

google.setOnLoadCallback(init);
