/* 
 * Gain access to the Prefences service.
 */
var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                            .getService(Components.interfaces.nsIPrefBranch);



/*
 * Called when the preference window loads.  Populates the rules List
 * based on the "extensions.urlswap.rules" preference.
 */
function populateUrlsList() {
	var prefString = prefManager.getCharPref("extensions.urlswap.rules");
	if(prefString == "")
		return;

	var urls = prefString.split(".NEXT.");
	var urlsList = document.getElementById("urlsList");

	for (var i=0; i < urls.length; i++) {
		var pieces = urls[i].split(".ITEM.");

		var newItem = document.createElement("treeitem");
		var newRow = document.createElement("treerow");
		newItem.appendChild(newRow);

        var url1 = document.createElement("treecell");
		url1.setAttribute("label", pieces[0]);
		newRow.appendChild(url1);

	    var url2 = document.createElement("treecell");
		url2.setAttribute("label", pieces[1]);
		newRow.appendChild(url2);

		urlsList.appendChild(newItem);
      }
    flipView("normal");
}



/*
 * Save the rules List to the "extensions.urlswap.rules" preference.
 * This is called by the pref's system when the GUI element is altered.
 */
function saveUrlsList() {
	var urlsList = document.getElementById("urlsList").childNodes;
	var prefString = "";
		for (var i=0; i < urlsList.length; i++) {
		var columns = urlsList[i].childNodes[0].childNodes;
		var str = columns[0].getAttribute("label") + ".ITEM."
                      + columns[1].getAttribute("label") + ".ITEM.";
		if(prefString == "")
			prefString = str;
		else
			prefString += ".NEXT." + str;
      }
	/* return the new prefString to be stored by pref system */
	return prefString;
}



/*
 * Populates the edit page with the given info
 */
function populateEdit(location1Str, location2Str, editIndexStr) {
	var location1 = document.getElementById("locationFindField");
	var location2 = document.getElementById("locationReplaceField");
	var editIndex = document.getElementById("editIndex");

	editIndex.value = "" + editIndexStr;
	location1.value = "" + location1Str;
	location2.value = "" + location2Str;
	
	location1.focus();
}



/*
 * Edits the currently selected rule
 */
function editRule() {
	var rulesTree = document.getElementById("rulesTree");
	var selectedIndex = rulesTree.currentIndex;

	/* Ignore the button if no rule selected */
	if(selectedIndex == -1)
		return;

	var urlsList = document.getElementById("urlsList");
	var entry = urlsList.childNodes[selectedIndex].childNodes[0].childNodes;

	populateEdit(entry[0].getAttribute("label"),
		       entry[1].getAttribute("label"),
			 selectedIndex);

	flipView("edit");
}



/*
 * Deletes the currently selected rule
 */
function deleteRule() {
	var rulesTree = document.getElementById("rulesTree");
	var index = rulesTree.currentIndex;

	if(index != -1) {
		var urlsList = document.getElementById("urlsList");
		var toRemove = urlsList.childNodes.item(index);
		urlsList.removeChild(toRemove);
	      document.getElementById("urlswapPane").userChangedValue(rulesTree);
	}
}



/*
 * Flips the view from/to informational/edit modes
 */
function flipView(mode) {
	var urlsListGroupBox = document.getElementById("urlsListGroupBox");
	var rulesEditorGroupBox = document.getElementById("rulesEditorGroupBox");
	
	
	if(mode == "edit") {
		urlsListGroupBox.setAttribute("hidden", "true");
		rulesEditorGroupBox.setAttribute("hidden", "false");
	} else {
		urlsListGroupBox.setAttribute("hidden", "false");
		rulesEditorGroupBox.setAttribute("hidden", "true");
	}
}

/*
 * Creates a new rule
 */
function newRule() {
	flipView("edit");
	populateEdit('','','');
}

/*
 * Called when a rule has been created/modified
 */
function saveRule() {
	
	var location1 = document.getElementById("locationFindField");
	var location2 = document.getElementById("locationReplaceField");

	var editIndex = document.getElementById("editIndex");	
	
	var urlsList = document.getElementById("urlsList");

	if(location1.value == "") {
		alert("You must enter a location!");
		return;
	}

	var newItem = document.createElement("treeitem");
	var newRow = document.createElement("treerow");
	newItem.appendChild(newRow);
	
	
    var url1 = document.createElement("treecell");
	url1.setAttribute("label", location1.value);
	newRow.appendChild(url1);
	
	var url2 = document.createElement("treecell");
	url2.setAttribute("label", location2.value);
	newRow.appendChild(url2);
	
	if(editIndex.value == "") {
		urlsList.appendChild(newItem);
	} else {
		var oldItem = urlsList.childNodes[parseInt(editIndex.value)];
		urlsList.replaceChild(newItem, oldItem);
	}
	var rulesTree = document.getElementById("rulesTree");
    document.getElementById("urlswapPane").userChangedValue(rulesTree);
    
	flipView("normal");
}



/*
 * Called when a rule that has been created/modified is cancelled.
 */
function cancelRule() {
	flipView("normal");
}



/*
 * Set To Current Page - allows user to select url based on current locations
 * Code modified from chrome://browser/content/preferences/general.xul.
 */
function setToCurrentPage(element) {
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
				.getService(Components.interfaces.nsIWindowMediator);
	var win = wm.getMostRecentWindow("navigator:browser");
	if (win) {
		var homePageField = document.getElementById(element);
	      var newVal = "";

	      var tabbrowser = win.document.getElementById("content");
      	var l = tabbrowser.browsers.length;
	      for (var i = 0; i < l; i++) {
      	  if (i)
	          newVal += "|";
      	  newVal += tabbrowser.getBrowserAtIndex(i).webNavigation.currentURI.spec;
	      }
      
      	homePageField.value = newVal;
	      document.getElementById("urlswapPane").userChangedValue(homePageField);
	}
}



/*
 * Set To Bookmark button - allows user to select url from bookmarks.
 * Code modified from chrome://browser/content/preferences/general.xul.
 */
function setToBookmark(element) {
		
	var rv = { urls: null };
	document.documentElement.openSubDialog("chrome://browser/content/bookmarks/selectBookmark.xul", "resizable", rv);  
	
	if (rv.urls) {
		var homePageField = document.getElementById(element);
		homePageField.value = rv.urls;
      	document.getElementById("urlswapPane").userChangedValue(homePageField);
	}
}



/*
 * Set to Blank Page - allows user to set URL to 'about:blank' easily.
 * Code modified from chrome://browser/content/preferences/general.xul.
 */
function setToBlankPage(element) {
	var homePageField = document.getElementById(element);
	homePageField.value = "about:blank";
      document.getElementById("urlswapPane").userChangedValue(homePageField);
}


/*
 * Moves the selected item up/down one place
 */
function move(dir) {
	var rulesTree = document.getElementById("rulesTree");
	var index = rulesTree.currentIndex;

	if(index != -1) {
		var urlsList = document.getElementById("urlsList");
		if(dir == "up" && index > 0) {
			var nextIndex = index - 1;
			var top = urlsList.childNodes[nextIndex];
			var bottom = urlsList.childNodes[index];
		} else if(dir == "down" && index < urlsList.childNodes.length - 1) {
			var nextIndex = index + 1;
			var top = urlsList.childNodes[index];
			var bottom = urlsList.childNodes[nextIndex];
		} else {
			return;
		}

		var oA = top.childNodes[0].childNodes[0].getAttribute("label");
		var oB = top.childNodes[0].childNodes[1].getAttribute("label");
		
		var iA = bottom.childNodes[0].childNodes[0].getAttribute("label");
		var iB = bottom.childNodes[0].childNodes[1].getAttribute("label");
		
		top.childNodes[0].childNodes[0].setAttribute("label", iA);
		top.childNodes[0].childNodes[1].setAttribute("label", iB);
		
		bottom.childNodes[0].childNodes[0].setAttribute("label", oA);
		bottom.childNodes[0].childNodes[1].setAttribute("label", oB);
		
		rulesTree.currentIndex = nextIndex;
		rulesTree.focus();
	    document.getElementById("urlswapPane").userChangedValue(rulesTree);
	}
}





