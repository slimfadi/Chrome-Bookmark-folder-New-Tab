function dumpTreeNodes(bookmarkNodes) {

	var list = $('<div id="bookmarks">');
	for (var i = 0; i < bookmarkNodes.length; i++) {
		list.append(dumpNode(bookmarkNodes[i]));
	}
	return list;
}
function dumpNode(bookmarkNode) {

	if (bookmarkNode.title) {
		var anchor = $('<a>').attr('href', bookmarkNode.url).text(bookmarkNode.title),
			rand_color_index = Math.ceil(Math.random()*10),
			colors=["#FFF8CB","#EBD3B1","#FFB5A5","#D7F7EC","#FFF2AA","#B8C3F1","#D4DAF2","#BDD4DE","#EFEFEF","#7794BC"];
		anchor.css({"background-color":colors[rand_color_index]});
	}
	return anchor;
}

document.addEventListener('DOMContentLoaded', function () {
	var bookmarkTreeNodes = chrome.bookmarks.getTree(
		function(bookmarkTreeNodes) {
			//limiting to the bookmarks bar
			var bookmarks_bar=bookmarkTreeNodes[0].children[0].children;
			var folder_name;
			for (var i = 0; i < bookmarks_bar.length; i++) {
				//read the folder name from the options and setting it to "good" if it's not set

				if (typeof localStorage["folder_name"] !== "undefined") {
					folder_name = localStorage["folder_name"];
				} else {
					folder_name = "good";
				}
				console.log(folder_name);
				if (bookmarks_bar[i].title && bookmarks_bar[i].title == folder_name) {
					var id=bookmarks_bar[i].id;
					$('body').append(dumpTreeNodes(bookmarks_bar[i].children));
					$('#manage').click(function() {
						chrome.tabs.create({url: "chrome://bookmarks#"+id});
					});
				}
			}
		}
	);
	$("#random").click(function(event) {
		var rand_index = Math.ceil(Math.random()*Number($("#bookmarks a").length));
		chrome.tabs.create({url: $("a").eq(rand_index).attr('href')});
	});
	$("#options").click(function(event) {
		chrome.tabs.create({url: chrome.extension.getURL("options.html")});
	});
});