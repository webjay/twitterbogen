
function init () {
  mosaic('http://api.flickr.com/services/feeds/photos_public.gne?id=91043280@N00&tags=twitterbogen&format=rss2');
  // are we framed?
  try {
    if (top.location.href !== window.location.href) {
      jQuery('#rightbar').hide();
    }
  } catch (e) {}
}

function mosaic (url) {
  var feed = new google.feeds.Feed(url);
  var rows = 3;
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

/* The End */

google.setOnLoadCallback(init);
