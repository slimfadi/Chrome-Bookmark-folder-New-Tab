function dumpTreeNodes(bookmarkNodes) {

	var list = $('<div>');
	for (var i = 0; i < bookmarkNodes.length; i++) {
		list.append(dumpNode(bookmarkNodes[i]));
	}
	return list;
}
function dumpNode(bookmarkNode) {

	if (bookmarkNode.title) {
		var anchor = $('<a>');
		anchor.attr('href', bookmarkNode.url);
		anchor.text(bookmarkNode.title);
	}
	var li = $(bookmarkNode.title ? '<li>' : '<div>').append(anchor);

	if (bookmarkNode.children && bookmarkNode.children.length > 0) {
		if(!bookmarkNode.title || bookmarkNode.title === "good2" || bookmarkNode.title === "Bookmarks Bar")
		li.append(dumpTreeNodes(bookmarkNode.children));
	}
	return anchor;
}

document.addEventListener('DOMContentLoaded', function () {
	var bookmarkTreeNodes = chrome.bookmarks.getTree(
		function(bookmarkTreeNodes) {
			//limiting to the bookmarks bar
			var bookmarks_bar=bookmarkTreeNodes[0].children[0].children;
			
			for (var i = 0; i < bookmarks_bar.length; i++) {
				//limiting the folder name to "swat"
				if (bookmarks_bar[i].title && bookmarks_bar[i].title== "swat") {
					var id=bookmarks_bar[i].id;
					$('#bookmarks').append(dumpTreeNodes(bookmarks_bar[i].children));
					$('#manage a').click(function() {
						chrome.tabs.create({url: "chrome://bookmarks#"+id});
					});
				}
			
			}
		}
	);
});
