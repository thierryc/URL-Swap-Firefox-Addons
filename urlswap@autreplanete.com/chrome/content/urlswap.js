/* 
 * Gain access to the Prefences service.
 */
var prefManager = Components.classes["@mozilla.org/preferences-service;1"]
                            .getService(Components.interfaces.nsIPrefBranch);



function urlswapRun() {
	var prefString = prefManager.getCharPref("extensions.urlswap.rules");
	var myurl = window._content.location.toString();
	var urls = prefString.split(".NEXT.");
	var needLoadURI = false;
	
	document.getElementByID('urlswap_sbi').setAttribute("src", "chrome://urlswap/content/images/urlswap18.png");
	
	for (var i=0; i < urls.length; i++) {
		var pieces = urls[i].split(".ITEM.");
		if (myurl.indexOf(pieces[0])!=-1) {
			needLoadURI = true;
			myurl = myurl.split(pieces[0]).join(pieces[1]);
	 	}
	 	else if (myurl.indexOf(pieces[1])!=-1) {
	 		needLoadURI = true;
	 		myurl = myurl.split(pieces[1]).join(pieces[0]);	 	
	 	}
	 }
	/* test before relaod */
	if (needLoadURI) window.loadURI(myurl);
}



function urlswap_init(e){
	
	
	/*
	var prefString = prefManager.getCharPref("extensions.urlswap.rules");
	var myurl = window._content.location.toString();
	var urls = prefString.split(".NEXT.");
	var needLoadURI = false;
	for (var i=0; i < urls.length; i++) {
		var pieces = urls[i].split(".ITEM.");
		if (myurl.indexOf(pieces[0])!=-1) {
			needLoadURI = true;
	 	}
	 	else if (myurl.indexOf(pieces[1])!=-1) {
	 		needLoadURI = true;	
	 	}
	 }
	
	if (!needLoadURI) document.getElementByID('urlswap_sbi').src = "chrome://urlswap/content/images/urlswap18_grey.png";
	*/
}



