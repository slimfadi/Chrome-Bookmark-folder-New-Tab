// Saves options to localStorage.
function save_options() {
	var input = document.getElementById("folder_name");
	var folder_name = input.value;
	localStorage["folder_name"] = folder_name;

	// Update status to let user know options were saved.
	var status = document.getElementById("status");
	status.innerHTML = "Folder Name Saved.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);
}
document.querySelector('#save').addEventListener('click', save_options);
document.addEventListener('DOMContentLoaded', function () {
	if (typeof localStorage["folder_name"] === "undefined") {
		localStorage["folder_name"]="good";
	}
	document.querySelector('#folder_name').value=localStorage["folder_name"];
})
