function dumpTreeNodes(bookmarkNodes) {

	var list = $('<div id="bookmarks">');
	for (var i = 0; i < bookmarkNodes.length; i++) {
		list.append(dumpNode(bookmarkNodes[i]));
	}
	return list;
}
function dumpNode(bookmarkNode) {

	if (bookmarkNode.title) {
		var anchor = $('<a>').attr('href', bookmarkNode.url).text(bookmarkNode.title);
		anchor.css({"background-color":get_random_color()});
	}
	return anchor;
}
function get_random_color(){
	var h=Math.random(),
	s=0.5,
	v=0.95,
	golden_ratio=0.618033988749895,
	h_i,f,p,q,t,r,g,b;

	h+=golden_ratio;
	h%=1;

	h_i = Math.floor(h*6);
	f = h*6 - h_i;
	p = v * (1-s);
	q = v * (1 - f*s);
	t = v * (1 - (1 - f) * s);
	switch (h_i) {
		case 0 :
			r=v;
			g=t;
			b=p;
		break;
		case 1:
			r=q;
			g=v;
			b=p;
		break;
		case 2:
			r=p;
			g=v;
			b=t;
		break;
		case 3:
			r=p;
			g=q;
			b=v;
		break;
		case 4:
			r=t;
			g=p;
			b=v;
		break;
		case 5:
			r=v;
			g=p;
			b=q;
		break;
	}
	return 'rgb('+parseInt(r*256)+','+parseInt(g*256)+','+parseInt(b*256)+')';
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