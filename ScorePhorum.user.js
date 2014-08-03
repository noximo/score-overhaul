// ==UserScript==
// @author         PiTRiS
// @name           ScorePhorum
// @namespace      Score
// @include        http://www.score.cz/phorum*
// @include        http://score.cz/phorum*
// ==/UserScript==

/*INSTALL
- firefox user: google - greasemonkey
- opera user: google - userjs
*/

/*CHANGELOG
--- testovano na: opera 9.26, opera 9.5, firefox 2.0.0.12 ---
- 2008-03-02 - prvni verze, skakani k prispevkum
- 2008-03-03 - jeden script pro ff i operu, skoky na dalsi/predchozi thread, odesilani prispevku pomoci ctrl-enter
- 2008-03-04 - trochu look :)
- 2008-03-04 - zas look, opraveny zorazovani linku ktery nikam nevedou
- 2008-03-04 - fixed position menu
- 2008-03-04 - opraveno nezobrazovani next prev u novejch threadu
- 2008-03-04 - pridano potvrzeni smazani zpravy
- 2008-03-06 - pridana funkcnost oblibenych - zatim pouze opera (sairon)
- 2008-03-10 - snad opravena nefunkcnost v nekterejch verzich opery
- 2008-03-10 - pridano automaticky refreshovani seznamu mistnosti (zatim pouze opera)
- 2008-03-29 - opraveno refreshovani seznamu mistnosti pro FF
- 2008-03-29 - opraveno pridavani, odebirani oblibenych pro FF, pridan potvrzovaci dialog
- 2008-03-29 - pridano "duraznejsi" uporozrneni na novou soukromou zpravu, zjednodusen kod pro jednoduchou aktivaci/deaktivaci modulu
- 2008-04-11 - pridany tlacitka link, img, spoil a my, moznost automatickyho stylovani pred odeslanim... nefugnuje ve foxu a trochu stylovani
- 2008-04-12 - opravy - funguje vse ve vsem, i styly :)
- 2008-04-12 - mini-update - vkladani obrazku automaticky na novej radek
- 2008-04-21 - pridana funkce automatickyho focusu textarey po kliku na reakci, aby se dalo hned psat
- 2008-04-25 - pridano stylovani textarey, tj treba zvetseni (standardne zvetsena)
- 2008-04-28 - pridany tlacitka pro bold a italic, zmeneno chovani spoil tlacitka
- 2008-05-10 - automaticky focusovani okna na vkladani hesla do mistnosti
- 2008-05-12 - odvsiveni, aby se to nezobrazovalo 2x
- 2008-05-12 - lehce pozmenena sekvence nacitani, na venek na rychly masine zadna zmena
- 2008-05-14 - fixed menu on hover!
- 2008-06-12 - pridano cls tlacitko pro operu 9.5
- 2008-06-14 - pridano potvrzovani u oznaceni mistnosti za neprectenou
- 2008-06-14 - pridano moderovani osobky, experimentalni, osklivy, funkcni :) !pozor!, vzdycky maze celej thread
- 2008-07-10 - upraveno zobrazovani tlacitek (text na stredu v ff3), automaticky zavirani delete/favorite popup okna (defaultne zavira po 1s, viz nastaveni)
- 2009-05-26 - pridanej redirect z phorum.php na phorum.php?id=asdasd - aby se zobrazily favorites
- 2009-07-17 - session refresh v místnosti
- 2009-07-19 - opera 10beta2 podpora
- 2009-07-20 - presmerovani na mistnosti s fav pouze pokud jeste nevyprsela session
- 2010-02-10 - chrome: oprava zobrazeni (thx John.26), podpora chrome
*/

// NASTAVENI
//STYLY
//styly new, prev, next
var styleNew="display:-moz-inline-box; display:inline-block; background:#979476; color:#79775e; margin-left:6px; width:35px; text-align:center; font-weight:bold; height:auto;";
var styleNext="display:-moz-inline-box; display:inline-block;background:#afab89; color:#79775e; margin-left:6px; width:35px; text-align:center; font-weight:bold; height:auto;";
var stylePrev=styleNext;
//styl menu
var styleMenu="position:fixed; opacity:.70; top:40%; right:0px; text-align:right; background:#94ada5; padding:5px; border:2px dashed #79775e; white-space:nowrap;";
var styleAMenu="display:block; font-weight:bold;";

//styl horniho divu s novejma zpravama
var styleNewMessCont="position:fixed; top:25px; left:2px; font-size:15px; color:red; background:#94ada5; border: 2px dashed #79775e; width:140px; text-align:center; font-weight:bold;";

//styl tlacitek u formu
var formLinkContainer=""; // styl kontejneru s tlacitkama
var formLinkHref="display:-moz-inline-box; display:inline-block; background:#85948f; border:1px solid black; color:black; margin:2px 6px 2px 0px; width:35px; text-align:center; font-weight:bold; height:auto;"; //tlacitko link
var formLinkImg=formLinkHref; //tlacitko img
var formSpoilImg=formLinkHref; //tlacitko spoil
var formMyStyleImg=formLinkHref; //tlacitko my
var formBImg=formLinkHref; //tlacitko b
var formIImg=formLinkHref; //tlacitko i
var formClear=formLinkHref; //tlacitko cls
var formFpImg=formLinkHref;

var myStyle="color:pink;"; //definice svyho stylu psani

var textAreaStyle = "width:500px; height:150px; border:none;";

var uname = "PiTRiS"; //your nickname
// KONEC STYLY

// SPOUSTENI MODULU
// co se vam nelibi tak zmenit true (zapnuto) na false (vypnuto)
var enableFixedMenu = true; // fixed menu
	var enableAutoHide = true; //automaticky skrejvani
	var enableNewMessAlert = true; // zvyrazneni novych zprav zavisly na povolenym fixed menu
	var enableNewMessDiv = true; // ten velkej div nahore s upozornenim zavisly na povolenym fixed menu
var enableAutoRefresh = true; // povoleni auto refreshe mistnosti
	var autoRefreshTime = 5; // cas pro autorefresh v minutach
var enableNewNextPrev = true; // povoleni zobrazovani NEW NEXT PREV v mistnostech
var enableProtectDelete = true; // povoleni dialogu pred smazanim zpravy
var enableFavorites = true; // povoleni na pridavani a odebirani z oblibenych
var enableEasySend = true; // povoleni odesilani pomoci ctrl enter
var enableFormatInput = true; // povoleni formatovacich tlacitek k textarea
var enableUseMyStyleAuto = false; // povoleni automatickyho formatovani textu mym stylem pred odeslanim
var enableFocusInputField = true; // automatickej focus textarea po rekci a tak :)
var enableStyleTextArea = true; // nastylovani text arey, treba zvetseni
var enableModPersonal = false; // moderovani osobky - zatim nefunkcni, work in progress, nezapinat ;)
var enableProtectUnread = true; //povoleni dialogu u oznaceni mistnosti za neprecteny
var enableAutoCloseDelWin = true; //povoleni automatickyho zavirani toho potvrzeni se smazanim
	var autoCloseDelWinTime = 1; //cas v sekundach za jak dlouho zavrit - 0 = hned po nacteni
var enableAutoCloseFavWin = true; //povoleni automatickyho zavirani toho potvrzeni s oblibenejma
	var autoCloseDelFavTime = 1; //cas v sekundach za jak dlouho zavrit - 0 = hned po nacteni
var enableRedirect = true; //presmerovani pokud vlezeme na score.cz/phorum.php a neni userid
var enableAjaxRef = true;
var enableChromeRepair = true; //aktivace "spravneho" zobrazeni (by John.26)
//KONEC SPOUSTENI MODULU

// KONEC NASTAVENI - tj, dal se v tom nestourat :))



//redirect kvuli bookmarks
var uid = readCookie('uid');
//porovonani expirace cookie pro redirect
var cookieTime = parseInt(readCookie('cooktime')) + 28*60;
var currentTime = parseInt(new Date().getTime().toString().substring(0, 10))
//alert('uid: ' + uid + ' time: ' + currentTime + ' cookietime: ' + cookieTime + ' difference: ' + (cookieTime - currentTime));


if ((document.URL == "http://www.score.cz/phorum.php" || document.URL == "http://score.cz/phorum.php") && uid != null && uid != "" &&
	(cookieTime > currentTime) && enableRedirect) {
	//alert('redirect');
	window.location = "http://www.score.cz/phorum.php?id=" + uid;
}

//spusteni pouze na score
if (document.URL.indexOf('score.cz/phorum') != -1 ) {
	//debug?
	var debug = false;
	
	//identifikace browseru
	var browser=navigator.appName;
	var nav_agent = navigator.userAgent;
	if (nav_agent.indexOf('Opera') != -1) {
		browser = 'Opera';
	} else if (nav_agent.indexOf('Chrome') != -1) {
		browser = 'Chrome';
	} else if (nav_agent.indexOf('Firefox') != -1) {
		browser = 'Firefox';
	}
	var b_version=navigator.appVersion;
	var version=parseFloat(b_version);
	
	//ajax
	
			
	// ajax req
	var xmlhttp;
	if (window.XMLHttpRequest) {
		// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	//xpathy
	var resultFirst = XPathResult.FIRST_ORDERED_NODE_TYPE;
	var resultOrdIter = XPathResult.ORDERED_NODE_ITERATOR_TYPE;
	var resultOrdSnap = XPathResult.ORDERED_NODE_SNAPSHOT_TYPE;
	
	//polozky
	//pole zpravy
	var inputField = document.getElementsByName("zprava")[0];
	var passwdField = document.getElementsByName("passwdfrm")[0];
	
	var sendButton = findSubmit();
	
	//event listenery
	//OLD WAY START - blblo zavirani popupu v 9.5
	/*if(window.location.hostname.match(/(^|\.)score.cz$/i)) {
		if (document.addEventListener) {
				//alert("testik");
				document.addEventListener("load",startScript, false);
		}else if (window.attachEvent) {
				//alert("test2");
				window.attachEvent('onload', startScript);
		}else{
				//alert("test4");
				/window.onload = startScript;
		}
	}*/
	
	//NEW - surprisingly working :)
	startScript();
}

//spousteni po startu
function startScript() {
	//co se pusti vsude
	//pridano saironem:
	var wParam = getUrlParameter("w");
	var kParam = getUrlParameter("kr");
	
	//co se pusti v osobce navic oproti mistnosti
	if (wParam==2 && kParam ==0) {
		if (enableModPersonal){
			modPersonal();
		}
	}
	
	if(wParam == false || wParam == 1) {
		//alert ("param 1");
		//co se spusti v seznamu mistnosti		
		
		if (document.URL.indexOf("http://www.score.cz/phorum/del.php") > -1) {
			//alert("test");
			if (enableAutoCloseDelWin) {
				timeout = autoCloseDelWinTime*1000;
				setTimeout("window.close();", timeout);
			}
		} else if (document.URL.indexOf("http://www.score.cz/phorum/oblibene.php") > -1) {
			if (enableAutoCloseFavWin) {
				timeout = autoCloseDelFavTime*1000;
				setTimeout("window.close();", timeout);
			}
		}
		
		if (enableAutoRefresh) {
			autoRefresh(autoRefreshTime); //automatickej refresh mistnosti, v zavorce minuty
		}
		
		if (enableFavorites) {
			scanRoomLinks(); //oblibene
		}
		
	}else if (wParam==2){
		//alert("param 2");
		//co se pusti v mistnosti¨
		//autoHref();
		
		if (enableChromeRepair) {
			if (browser == 'Chrome') {
				chromeRepair();
			}
		}
		
		if (enableStyleTextArea) {
			try {
				styleTextArea();
			} catch (e) {
			
			}
		}	
		
		if (enableFocusInputField) {
			focusInputField();
			try {
				focusPasswdField();
			} catch(e) {
				
			}
		}		
		
		if (enableEasySend) {
			try {
				easySend(); // odesilani pomoci ctrl enter
			} catch (e) {
			
			}
		}
		
		if (enableFormatInput) {
			try {
				formatInput(); //formatovaci tlacitka k textu	
			} catch (e) {
			
			}
		}
		
		if (enableUseMyStyleAuto) {
			try {
				autoFormatInput();	
			} catch (e) {
			
			}
		}
		
		if (enableNewNextPrev) {
			doTheJob(); // oznaceni new, prev, next
		}	
		
		if (enableProtectDelete) {
			try {
				protectDelete(); // potvrzeni mazani
			} catch (e) {
			
			}
		}
		
		if (enableAjaxRef) {
			setInterval(ajaxRef, 15*60*1000);
		}
	} else if (wParam == 10) {
		deleteCookie('cooktime', '/', '') 
		deleteCookie('uid', '/', '') 
	}
	
	if (enableFixedMenu) {
		fixedMenu();
	}
	if (enableProtectUnread) {
		protectUnread();	
	}
}

//chrome repair - thx to john.26
function chromeRepair() {
	var tables = document.getElementsByTagName('table'); 

	for (var i = 0; i < tables.length; i++) { 
		if(tables[i].getAttribute('width') == "100%" && tables[i].getAttribute('cellpadding') == "1") {
			tables[i].parentNode.parentNode.parentNode.parentNode.setAttribute('width', '100%');
		}
	}
}
//refresh mistnosti
function autoRefresh(minutes) {
	var time = minutes*1000*60;
	setTimeout('window.location.reload();', time);
}

//obsluha prispevku
function doTheJob() {
	var td = getElementsByClass("prispevek", "td");
	var msgsWidth = new Array();
	var msgsIsNew = new Array();
	var msgsNode = new Array();
	
	if (browser == "Opera") { //nody pro operu
		for (i in td) {			
			//pole nodu kam psat
			try {
				if (version >= 9.8) {
					msgsNode[i] = td[i].parentNode.previousSibling.childNodes[1].childNodes[1].childNodes[1].childNodes[0].childNodes[0];
					debugJs(msgsNode[i].innerHTML);
				} else {
					msgsNode[i] = td[i].parentNode.previousSibling.childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[0];
				}
			}catch (err){
				//appendElem("errorNode-op");
			}
			
			//pole sirek
			try {
				msgsWidth[i] = td[i].previousSibling.getAttribute("width");
			} catch (err) {
				//appendElem("errorWidth-op");	
			}
			
			//pole img new
			try {
				if (td[i].parentNode.previousSibling.firstChild.firstChild.getAttribute("src")) {
					msgsIsNew[i]=true;
				} else {
					msgsIsNew[i]=false;
				}
			} catch (err) {
				//appendElem("errorImg-op");
			}
		}
	} else { //nody pro zbytek (FF)
		for (i in td) {
			//pole nodu kam psat
			try {
				msgsNode[i] = td[i].parentNode.previousSibling.previousSibling.childNodes[3].childNodes[1].childNodes[1].childNodes[0].childNodes[1];
				debugJs(msgsNode[i].innerHTML);
			} catch (err) {
				//appendElem("errorNode-FF");
			}
			
			//pole sirek
			try {
				msgsWidth[i] = td[i].previousSibling.previousSibling.getAttribute("width");
			} catch (err) {
				//appendElem("errorWidth-FF");
			}
			
			//pole img new
			try {
				if (td[i].parentNode.previousSibling.previousSibling.childNodes[1].firstChild.getAttribute("src")) {
					msgsIsNew[i]=true;
				} else {
					msgsIsNew[i]=false;
				}
			} catch (err){
				//appendElem("errorImg-FF");
			}
		}
	}
	
	var x = 0; //pocitadlo pro no-new prispevky
	var y = 0; //pocitadlo pro thread
	var z = 0; //pocitadlo vsech prispevku
	var threadArray = new Array();
	var threadNode;
	var isDone=new Boolean(false);
	
	//new msg
	for (i in msgsWidth) {
		if (msgsWidth[i] == 45) {
			threadArray[z] = i;
			z++;
			//pridani linku na new message
			if (!msgsIsNew[i]) {
				x++;
				threadNode = i;
				isDone=false;
				//appendElem(msgsWidth[i]);
			}
		} else if (msgsWidth[i] == 85) {
			if (msgsIsNew[i] && !isDone) {
				appendTarget(x, 1, msgsNode[i]);
				appendTarget(x, 0, msgsNode[threadNode])
				isDone=true;
			}
		}
	}
	
	//prev next - linky
	for (i in threadArray) {
		if (i==0) {
			appendTarget(y, 2, msgsNode[threadArray[i]]);
			appendTarget(y, 5, msgsNode[threadArray[i]]);
		} else if (i==(threadArray.length-1)) {
			appendTarget(y, 3, msgsNode[threadArray[i]]);
			appendTarget(y, 4, msgsNode[threadArray[i]]);
		} else {
			appendTarget(y+1, 2, msgsNode[threadArray[i]]);
			appendTarget(y+1, 5, msgsNode[threadArray[i]]);			
			appendTarget(y, 3, msgsNode[threadArray[i]]);
			appendTarget(y, 4, msgsNode[threadArray[i]]);
			y++;
		}
	}
}

//pridani targetu
function appendTarget(id, type, node) {
	var newel;
	var newtext;
	var target="new"+id;
	var nextThread="nextthread"+id;
	var prevThread="prevthread"+id;
	if (node!=null) {
		switch (type) {
			//a href na novej prispevek
			case 0:
				newel=document.createElement("a");
				newtext=document.createTextNode("New");
				newel.setAttribute("href","#"+target);
				newel.setAttribute("style",styleNew);
				newel.appendChild(newtext);
				break;
			//a name novyho prispevku
			case 1:
				newel=document.createElement("a");
				//newtext=document.createTextNode("Go to new");
				newel.setAttribute("name",target);
				//newel.appendChild(newtext);
				break;
			//a href na dalsi thread
			case 2:
				newel=document.createElement("a");
				newtext=document.createTextNode("Next");
				newel.setAttribute("href","#"+nextThread);
				newel.setAttribute("style",styleNext);
				newel.appendChild(newtext);
				break;
			//a name dalsiho threadu
			case 3:
				newel=document.createElement("a");
				//newtext=document.createTextNode("Go to new");
				newel.setAttribute("name",nextThread);
				//newel.appendChild(newtext);
				break;
			//a href na predchozi thread
			case 4:
				newel=document.createElement("a");
				newtext=document.createTextNode("Prev");
				newel.setAttribute("href","#"+prevThread);
				newel.setAttribute("style",stylePrev);
				newel.appendChild(newtext);
				break;
			//a name dalsiho threadu
			case 5:
				newel=document.createElement("a");
				//newtext=document.createTextNode("Go to new");
				newel.setAttribute("name",prevThread);
				//newel.appendChild(newtext);
				break;		
		}
	}else{
		alert("watafak, nekdo tu neco seredne posral (a ja to nebyl!)");
	}
	node.appendChild(newel);
}


//ctrl enter pridani eventu
function easySend() {
	if(inputField) {
		inputField.addEventListener("keypress", ctrlEnter, false);
	}else{
		window.addEventListener("keypress", ctrlEnter, false);
	}
}
//ctrl enter manipulace
function ctrlEnter(e) {
	var code;
	var ctrl=false;
	if (!e) {
		var e=window.event;
	}

	if (e.ctrlKey) {
		ctrl=true;
	}
	if (e.keyCode) { 
		code=e.keyCode; 
	} else if (e.which) {
		code=e.which;
	}
	
	if (code==10 || (ctrl && code==13)) {
		sendButton.click();
	}
}

//menu a nastaveni fixed
function fixedMenu() {
	var menuItems=getElementsByClass("phmenu")[0].getElementsByTagName("a");
	
	var node=document.createElement("div");
	node.setAttribute("style",styleMenu);
	node.setAttribute("id","fmenu");
	
	if (enableAutoHide) {
		node.addEventListener("mouseover", changePos, false);
		node.addEventListener("mouseout", changePos, false);
		node.style.width="0px";
		node.style.overflow="hidden";
		node.style.padding="10px 0px 10px 20px";
		//width:0px; overflow:hidden; padding:10px 0px 10px 20px; white-space:nowrap;
	}
	
	var newel;
	var ahref;
	var atext;
	var num;
	var newtext;
	
	for (i=0;i<menuItems.length;i++){
		ahref=menuItems[i].getAttribute("href");
		atext=menuItems[i].firstChild.textContent;
		try {
			num = parseInt(atext);
			if (num>0 && enableNewMessAlert) {
				menuItems[i].firstChild.setAttribute("style","color:red;");
				
				//ZACATEK - zobrazeni divu nahore
				if (enableNewMessDiv) {
					newel = document.createElement("a");
					newel.setAttribute("href",ahref);
					newel.setAttribute("style",styleNewMessCont);
					var text="Nove zpravy: "+num;
					newtext=document.createTextNode(text);
					newel.appendChild(newtext);
					document.body.appendChild(newel);
				}
				//KONEC - zobrazeni divu nahore
			}
		}catch (err) {
		}
		newel=document.createElement("a");
		newtext=document.createTextNode(atext);
		newel.setAttribute("href",ahref);
		newel.setAttribute("style",styleAMenu);
		newel.appendChild(newtext);
		node.appendChild(newel);
	}
	document.body.appendChild(node);
}

function changePos(){
	div=document.getElementById("fmenu");
	//alert(div.style.right);
	if (div.style.width=="0px") {
		div.style.width="90px";
	}else{
		div.style.width="0px";
	}
}

//POTVRZOVACI DIALOG BOXY
//dialog box u smaz
function protectDelete() {
	var a = document.body.getElementsByTagName("a");
	//appendElem(a[1]);
	var patt=new RegExp("javascript:smaz");
	//var x;
	for (i=0;i<a.length;i++) {
		if(patt.test(a[i].getAttribute("href"))){
			//x=parseInt(a[i].getAttribute("href"));
			//a[i].removeAttribute("href");
			a[i].addEventListener("click",deleteClick, false);
			
		}
	}
}
function deleteClick(e) {
	if(!confirm("Fakt to chceš smazat?")){
		e.preventDefault();
	}
}

//dialog box u unreadu
function protectUnread() {
	var a = document.body.getElementsByTagName("a");
	//appendElem(a[1]);
	var patt=new RegExp("reset.php");
	//var x;
	for (i=0;i<a.length;i++) {
		if(patt.test(a[i].getAttribute("href"))){
			//x=parseInt(a[i].getAttribute("href"));
			//a[i].removeAttribute("href");
			a[i].addEventListener("click",unreadClick, false);
			
		}
	}
}
function unreadClick(e){
	if(!confirm("Fakt to chceš označit za nepřečtený?")){
		e.preventDefault();
	}
}

//auto focusovani text area
function focusInputField() {
	var a = document.body.getElementsByTagName("a");
	//appendElem(a[1]);
	var patt=new RegExp("javascript:user");
	//var x;
	for (i=0;i<a.length;i++) {
		if(patt.test(a[i].getAttribute("href"))){
			//x=parseInt(a[i].getAttribute("href"));
			//a[i].removeAttribute("href");
			a[i].addEventListener("click",focusField, false);			
		}
	}
}
function focusField() {
	setTimeout(inputField.focus(), 250);
}
function focusPasswdField() {
	passwdField.focus();
}
function autoFormatInput() {
	sendButton.addEventListener("click",insertMyStyle, false);
}

//textarea tlacitka
function formatInput() {
	var newel;
	var newtext;
	var node = inputField;
	var container=document.createElement("div");
	container.setAttribute("style",formLinkContainer);
	
	newel=document.createElement("a");
	newel.setAttribute("href","#");
	newel.setAttribute("style",formLinkHref);
	newel.addEventListener("click",insertLink, false);
	newtext=document.createTextNode("link");	
	newel.appendChild(newtext);
	container.appendChild(newel);
	
	newel=document.createElement("a");
	newel.setAttribute("href","#");
	newel.setAttribute("style",formLinkImg);
	newel.addEventListener("click",insertImg, false);
	newtext=document.createTextNode("img");	
	newel.appendChild(newtext);
	container.appendChild(newel);
	
	newel=document.createElement("a");
	newel.setAttribute("href","#");
	newel.setAttribute("style",formSpoilImg);
	newel.setAttribute("id","sc-spoil");
	newel.addEventListener("click",insertSpoil, false);
	newtext=document.createTextNode("spoil");	
	newel.appendChild(newtext);
	container.appendChild(newel);
	
	newel=document.createElement("a");
	newel.setAttribute("href","#");
	newel.setAttribute("style",formBImg);
	newel.setAttribute("id","sc-b");
	newel.addEventListener("click",insertB, false);
	newtext=document.createTextNode("b");	
	newel.appendChild(newtext);
	container.appendChild(newel);
	
	newel=document.createElement("a");
	newel.setAttribute("href","#");
	newel.setAttribute("style",formIImg);
	newel.setAttribute("id","sc-i");
	newel.addEventListener("click",insertI, false);
	newtext=document.createTextNode("i");	
	newel.appendChild(newtext);
	container.appendChild(newel);
	
	if (!enableUseMyStyleAuto) {
		if (myStyle!="" && myStyle!="{}") {
			newel=document.createElement("a");
			newel.setAttribute("href","#");
			newel.setAttribute("style",formMyStyleImg);
			newel.addEventListener("click",insertMyStyle, false);
			newtext=document.createTextNode("my");	
			newel.appendChild(newtext);
			container.appendChild(newel);
		}
	}
	
	if (browser=="Opera" && version=="9.5") {
		newel=document.createElement("a");
		newel.setAttribute("href","#");
		newel.setAttribute("style",formClear);
		newel.setAttribute("id","sc-cls");
		newel.addEventListener("click",clearScr, false);
		newtext=document.createTextNode("cls");	
		newel.appendChild(newtext);
		container.appendChild(newel);
	}
	
	node.parentNode.insertBefore(container,node);
}

function insertLink() {
	var href = prompt("Vlozte URL");
	var text = prompt("Vlozte text");
	if (href!="" && href) {
		if (text!="" && text) {
			inputField.value = inputField.value+'<a href="'+href+'">'+text+'</a>';
		} else {
			inputField.value = inputField.value+'<a href="'+href+'">'+href+'</a>';
		}
	}
	inputField.focus();
	return false;
}

function insertImg() {
	var href = prompt("Vlozte  URL");
	if (href!="" && href) {
		inputField.value = inputField.value+'\n<img src="'+href+'" />\n';
	}
	inputField.focus();
	return false;
}

var boolSpoil = false;
function insertSpoil() {		
	if (boolSpoil) {
		inputField.value = inputField.value+'</span>&lt;/!SPOIL!&gt;';
		document.getElementById("sc-spoil").textContent="spoil";
		boolSpoil = false;
	}else{
		inputField.value = inputField.value+'&lt;!SPOIL!&gt;<span style="{color:#94ada5;}">';
		document.getElementById("sc-spoil").textContent="/spoil";
		boolSpoil = true;
	}
	inputField.focus();
	return false;
}

var boolB = false;
function insertB() {
	if (boolB) {
		inputField.value = inputField.value+'</b>';
		document.getElementById("sc-b").textContent="b";
		boolB = false;
	}else{
		inputField.value = inputField.value+'<b>';
		document.getElementById("sc-b").textContent="/b";
		boolB = true;
	}
	inputField.focus();
	return false;
}

var boolI = false;
function insertI() {
	if (boolI) {
		inputField.value = inputField.value+'</i>';
		document.getElementById("sc-i").textContent="i";
		boolI = false;
	}else{
		inputField.value = inputField.value+'<i>';
		document.getElementById("sc-i").textContent="/i";
		boolI = true;
	}
	inputField.focus();
	return false;
}

function insertMyStyle() {
	if (myStyle!="" && myStyle!="{}") {
		inputField.value = '<span style="'+myStyle+'">'+inputField.value+'</span>';
	}
	inputField.focus();
	return false;
}

function clearScr(){
	inputField.value = "";
	//document.getElementsByName("reader")[0].value="all";	
}

//nastylovani textarea
function styleTextArea() {
	inputField.setAttribute("style",textAreaStyle);
}

function ajaxRef() {
	xmlhttp.open("POST","phorum/add_message.php",true);
	xmlhttp.send(null);
}

function modPersonal() {
	//xpath
	//whole node s prispevkem
	/*
	/html/body/table/tbody/tr/td[2]/table[3]/tbody/tr/td[2]/table/tbody/tr/td/table[4]/tbody - node s celym prispevkem
	/html/body/table/tbody/tr/td[2]/table[3]/tbody/tr/td[2]/table/tbody/tr/td/table[4]/tbody/tr[2]/td/a - noda s linkem
	/html/body/table/tbody/tr/td[2]/table[3]/tbody/tr/td[2]/table/tbody/tr/td/table[4]/tbody/tr/td[2]/table/tbody/tr/td/a[2]
	/html/body/table/tbody/tr/td[2]/table[3]/tbody/tr/td[2]/table/tbody/tr/td/table[2]
	*/
	var items = find('//html/body/table/tbody/tr/td[2]/table[3]/tbody/tr/td[2]/table/tbody/tr/td/table/tbody',resultOrdIter);
	//appendElem("test");
	var i = 10;
	
	var testArr = new Array();
  	var twoItem = items.iterateNext();

	while (twoItem) {
		testArr.push(twoItem);
		twoItem = items.iterateNext();
	}	
	
	var patt=new RegExp("od:");
	for (j in testArr) {
					
		if(patt.test(testArr[j].textContent)) {			
			//appendElem(testArr[j].textContent);
			var jsLink = find("//parent::tbody/tr[2]/td/a",resultOrdSnap,testArr[j]).snapshotItem(i);
			//appendElem(jsLink);
			//var appendLink = find("//parent::tbody/tr/td[2]/table/tbody/tr/td",resultOrdSnap,testArr[j]).snapshotItem(i); ;
			
			//var appNode = find("//parent::td/b[2]/a",resultOrdSnap,testArr[j]).snapshotItem(i);
			//javascript:user('PiTRiS',0,3554589)
			var pat = /javascript:user\('[a-z]+',\d,(\d+)\)/i;
			
			var matches = jsLink.href.match(pat);
			if (matches!=null){
				var id = matches[1];
				
				var newel=document.createElement("a");
				newel.setAttribute("href","javascript:smaz("+id+")");
				newtext=document.createTextNode("smaž");	
				newel.appendChild(newtext);
				testArr[j].appendChild(newel);
				//appendElem(newel, testArr[j]);
			}
			i++;
		}
	}
}

//replace hrefu v textu
/*function autoHref() {
	sendButton.addEventListener("click",hrefIt, false);
}

function hrefIt(e){
	var text = inputField.value;
	var re = new RegExp("(http://|https://|ftp://)(\\w*)(\\s)", "g");
	alert(re.exec(text));
	e.preventDefault();
}*/


//UNIVERSAL
//debug
function debugJs(mess) {
	if (debug) {
		if (mess == null || mess == "") {
			mess = "null";
		}
		appendElem(mess);
	}
}
//nalezeni class - prevzato z http://www.dustindiaz.com/getelementsbyclass/
function getElementsByClass(searchClass,tag,node) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {			
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

//nalezeni submitu
function findSubmit() {
	var inputs = document.body.getElementsByTagName("input");
	var button;
	for (i in inputs) {
		//appendElem("teest2");
		try {
			if (inputs[i].getAttribute("value")=="Odeslat") {
				button = inputs[i];
				break;
			}
		} catch (err) {
			//appendElem("errorSubmit");
		}
	}
	return button;
}

//**********************
//***pridano saironem***
//**********************

//hledani node podle xpath
function find(xpath, restype, contextNode) {
  if(contextNode == null) contextNode = document;
  var ret = document.evaluate(xpath, contextNode, null, restype, null);
  return restype==resultFirst ? ret.singleNodeValue : ret;
}

//pridani odkazu na oblibene
function scanRoomLinks() {
  //ziskani userID - v menu je vzdy
  var reg = /\?id=(\d+)/i;
  var menuLink = find('//td[@class="phmenu"]/a',resultFirst);
  var matches = menuLink.href.match(reg);
  var userID = matches[1];
  // 				/html/body/table/tbody/tr/td[2]/table[3]/tbody/tr/td[2]/table/tbody/tr/td/table/tbody/tr/td[2]
  var items = find('//html/body/table/tbody/tr/td[2]/table[3]/tbody/tr/td[2]/table/tbody/tr/td/table/tbody/tr/td[2]',resultOrdIter);
  var i = 0;
  var testArr = new Array();
  var twoItem = items.iterateNext();


	while (twoItem) {
		testArr.push(twoItem);
		twoItem = items.iterateNext();
	}

  for( j in testArr) {
	//appendElem(testArr[j]);	
    if(testArr[j].textContent.charAt(0) != "p")
    {
      var roomLink = find("//parent::td/b/a",resultOrdSnap,testArr[j]).snapshotItem(i);
	  //appendElem(roomLink);
	  
      var reg2 = /kr=(\d+)/i;
       matches = roomLink.href.match(reg2);
      var roomID = matches[1];

      //pridavani
      link = document.createElement("a");
      link.setAttribute("href","#");
      link.setAttribute("onclick","if(confirm('Opravdu chces pridat mistnost mezi oblibene?')) {window.open('phorum/oblibene.php?id="+userID+"&r="+roomID+"&a=1', null, 'width=140, height=80, scrollbars = no'); return false;}");
      linkText = document.createTextNode(" +");
      link.appendChild(linkText);
      testArr[j].appendChild(link);

      //mazani
      link = document.createElement("a");
      link.setAttribute("href","#");
      link.setAttribute("onclick","if(confirm('Opravdu chces odebrat mistnost z oblibenych?')) {window.open('phorum/oblibene.php?id="+userID+"&r="+roomID+"&a=0', null, 'width=140, height=80, scrollbars = no'); return false;}");
      linkText = document.createTextNode(" -");
      link.appendChild(linkText);
      testArr[j].appendChild(link);
      i++;
    }
  }
}

//ziskani parametru hodnoty paramatru par z aktualni url 
function getUrlParameter(par) {
  var reg = new RegExp('&'+par+'=([^&]*)','i');
 
  var parameters = window.location.search;
  parameters = parameters.replace(/^\?/,'&').match(reg);
  if(parameters==null) return false;
  return parameters=parameters[1];
}

//pridani elementu na konec dokumentu
function appendElem(text, node, type) {
	if (type==null) {
		type="p";
	}
	if (node==null) {
		node=document.body;
	}
	var newel=document.createElement(type);
	var newtext=document.createTextNode(text);
	newel.appendChild(newtext);
	node.appendChild(newel);
}

//read cookie
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function setCookie(c_name,value,expiredays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

function deleteCookie(name, path, domain) {
	if (readCookie(name)) document.cookie = name + "=" +
	( ( path ) ? ";path=" + path : "") +
	( ( domain ) ? ";domain=" + domain : "" ) +
	";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}
