function loadBookmarks() {
	$("#bookmarks").remove();

	for (var i = 0; i < bookmarks_bar.length; i++) {
		//read the folder name from the options and setting it to "good" if it's not set

		if (bookmarks_bar[i].title && bookmarks_bar[i].title == folder_name) {
			folder_id=bookmarks_bar[i].id;
			$('body').append(dumpTreeNodes(bookmarks_bar[i].children));
		}
	}
}

function loadFolders() {
	for (var i = 0; i < bookmarks_bar.length; i++) {
		if (bookmarks_bar[i].title && bookmarks_bar[i].children) {

			$("#folder").append($("<option />").val(bookmarks_bar[i].title).text(bookmarks_bar[i].title));
		}
	}

	if ( folder_name === "" ) {
		folder_name=$("#folder").children('option').eq(0).val();
	}

	$("#folder").val(folder_name).change();
}

function dumpTreeNodes(bookmarkNodes) {

	var list = $('<div id="bookmarks">');
	for (var i = 0; i < bookmarkNodes.length; i++) {
		list.append(dumpNode(bookmarkNodes[i]));
	}
	return list;
}

function dumpNode(bookmarkNode) {
	if (bookmarkNode.url) {
		var anchor = $('<a>').attr('href', bookmarkNode.url).text(bookmarkNode.title);
		anchor.css({"background-color":generateColor()});
	}
	return anchor;
}
function goToRandomLink(){
	var rand_index = Math.ceil(Math.random()*Number($("#bookmarks a").length));
	chrome.tabs.create({url: $("a").eq(rand_index).attr('href')});
}

function generateColor(){
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
	folder_name = "";
	bookmarks_bar = "";
	folder_id=0;
	if (typeof localStorage["folder_name"] !== "undefined") {
		folder_name = localStorage["folder_name"];
	}

	chrome.bookmarks.getTree(
		function(bookmarkTreeNodes) {
			//limiting to the bookmarks bar
			if (bookmarkTreeNodes[0].children && bookmarkTreeNodes[0].children[0].children) {
				bookmarks_bar=bookmarkTreeNodes[0].children[0].children;
			}
			loadBookmarks(folder_name);
			loadFolders();
		}
	)

	$("#random").click(function(event) {
		goToRandomLink();
	});
	$("#folder").change(function(){
		folder_name=$(this).val();
		localStorage["folder_name"]=folder_name;
		loadBookmarks(folder_name);
	});
	$('#manage').click(function() {
		chrome.tabs.create({url: "chrome://bookmarks#"+folder_id});
	});
	$("body").keyup(function(e){
		switch (e.which) {
			case 78:
				var next_folder
				/*n*/
				if(typeof $("#folder option:selected").next().val() !== "undefined") {
					next_folder=$("#folder option:selected").next().val();
				} else {
					next_folder=$("#folder option").eq(0).val();
				}
				$("#folder").val(next_folder);
				$("#folder").change();
			break;
			case 86:
				goToRandomLink();
			break;
			case 77:
				$("#manage").click();
			break;
		}
	});
});
