function loadBookmarks() {
	$("#bookmarks").remove();

	for (var i = 0; i < bookmarks_bar.length; i++) {
		//read the folder name from the options and setting it to "good" if it's not set

		if (bookmarks_bar[i].id && bookmarks_bar[i].id == folder_id) {
			$('body').append(dumpTreeNodes(bookmarks_bar[i].children));
		}
	}
}

function loadFolders() {
	for (var i = 0; i < bookmarks_bar.length; i++) {
		if (bookmarks_bar[i].title && bookmarks_bar[i].children) {

			$(".folders").append($("<div/>").addClass("folder").attr("id","folder-"+bookmarks_bar[i].id).text(bookmarks_bar[i].title));
		}
	}

	if ( folder_id === 0 ) {
		folder_id = $(".folders").children('.folder').eq(0).attr("id").replace("folder-","");
	}
	loadActiveFolderBookmarks(folder_id);

}

function dumpTreeNodes(bookmarkNodes) {

	var list = $('<div id="bookmarks">');
	for (var i = bookmarkNodes.length-1; i >-1 ; i--) {
		list.append(dumpNode(bookmarkNodes[i]));
	}
	return list;
}

function dumpNode(bookmarkNode) {
	if (bookmarkNode.url) {
		var anchor = $('<div>').addClass('bookmark');
		var link = $('<a>').attr('href', bookmarkNode.url).text(bookmarkNode.title).addClass("link");
		anchor.append(link);
		anchor.append("<a class='delete' data-id='"+bookmarkNode.id+"' style='width:20px;height:20px;background-color:black;'></div>")
		anchor.css({"background-color":generateColor()});
	}
	return anchor;
}
function goToRandomLink(){
	var rand_index = Math.ceil(Math.random()*Number($("#bookmarks a").length));
	chrome.tabs.create({url: $(".link").eq(rand_index).attr('href')});
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
	return '#fff';
	return 'rgb('+parseInt(r*256)+','+parseInt(g*256)+','+parseInt(b*256)+')';
}

function loadActiveFolderBookmarks(folder_id) {
	localStorage["folder_id"]=folder_id;
	loadBookmarks(folder_id);
	$(".folder.active").removeClass("active");
	$("#folder-"+folder_id).addClass("active");
}

document.addEventListener('DOMContentLoaded', function () {
	bookmarks_bar = "";
	folder_id=0;
	if (typeof localStorage["folder_id"] !== "undefined") {
		folder_id = localStorage["folder_id"];
	}

	chrome.bookmarks.getTree(
		function(bookmarkTreeNodes) {
			//limiting to the bookmarks bar
			if (bookmarkTreeNodes[0].children && bookmarkTreeNodes[0].children[0].children) {
				bookmarks_bar=bookmarkTreeNodes[0].children[0].children;
			}
			loadFolders();
			loadBookmarks(folder_id);
		}
	);

	$(".delete").live("click",function(){
		that=$(this);
		if (confirm("dude?")) {
			chrome.bookmarks.remove(that.attr("data-id"),function(){
				that.parents(".bookmark").remove();
			})
		}
	});

	$("#random").click(function(event) {
		goToRandomLink();
	});
	$(".folder").live("click",function(){
		folder_id=$(this).attr("id").replace("folder-","");
		loadActiveFolderBookmarks(folder_id);
	});

	$('#manage').click(function() {
		chrome.tabs.create({url: "chrome://bookmarks#"+folder_id});
	});
	$("body").keydown(function(e){
		switch (e.which) {
			case 86:
				//v
				goToRandomLink();
			break;
			case 77:
				//m
				$("#manage").click();
			break;
			case 40:
				//down
				e.preventDefault();
				if($(".folder.active").next().length) {
					$(".folder.active").next().click();
				} else {
					$(".folder:first").click();
				}
			break;
			case 38:
				//up
				e.preventDefault();
				if($(".folder.active").prev().length) {
					$(".folder.active").prev().click();
				} else {
					$(".folder:last").click();
				}
			break;
		}
	});
});
