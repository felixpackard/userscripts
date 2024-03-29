// ==UserScript==
// @name         Morse Code Bot
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A bot to send morse code messages on morsecode.me
// @author       deadpixl
// @match        http://morsecode.me/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...
	let code = `
		<div class="withbg" style="position:fixed;top:10px;left:0;width:200px;height:240px;font-size:14px;10px;">
			<p style="font-size:18px;">Morse Code Bot<br /><span style="font-size:14px;">by deadpixl</span></p>
			<p></p>
			<p>wpm<br />
			<input id="customWpmInput" type="number" style="background:transparent;border:1px solid white;color:white;font-family:"Cutive Mono", monospace;" value="15"></p>
			<p></p>
			<p>message<br />
			<textarea id="customMessageTextarea" placeholder="enter message..." style="width:180px;height:50px;background:transparent;border:1px solid white;color:white;font-family:"Cutive Mono", monospace;"></textarea></p>
			<p></p><p><span id="customSendButton" style="cursor:pointer;">[send]</span></p>
			<p></p><p><span id="customPeriodButton" style="cursor:pointer;color:red;">[manual]</span>  <span id="customWelcomeButton" style="cursor:pointer;color:red;">[welcome]</span></p>
		</div>
		<style>
			#customMessageTextarea:focus
			{
				outline-color:white !important;
			}
		</style>
	`;
	$("#content").append(code);
	$(document).unbind("keydown");
	$(document).unbind("keyup");
	
	let numToSend;
	let theMessage;
	let messageLocation;
	let unitLength = 100;
	let finishedKeying = true;
	let periodEnabled = false;
	let welcomeEnabled = false;

	// define a new console
	var console=(function(oldCons){
	    return {
	        log: function(text){
	            oldCons.log(text);
	            // Your code
	            if (String(text).indexOf("joined channel") > -1 && welcomeEnabled && finishedKeying)
	            {
	            	sendMessage("hello, " + text.substr(0,4).toLowerCase() + "!");
	            }
	        },
	        info: function (text) {
	            oldCons.info(text);
	            // Your code
	        },
	        warn: function (text) {
	            oldCons.warn(text);
	            // Your code
	        },
	        error: function (text) {
	            oldCons.error(text);
	            // Your code
	        }
	    };
	}(window.console));

	//Then redefine the old console
	window.console = console;

	setUnitLength(15);

	function setUnitLength(wpm)
	{
		unitLength=1200/(wpm-5);
		console.log(unitLength);
	}

	function sendMessage(msg) {
		finishedKeying = false;
	    theMessage = "";
	    messageLocation = 0;
	    for (let i = 0; i < msg.length; i++) {
	        theMessage += morseTextDict[msg[i]] + " "
	    }
	    sendCharacter()
	}

	function sendCharacter() {
	    if (messageLocation > theMessage.length) {
	    	finishedKeying = true;
	        console.log("done!");
	        return
	    }
	    if (theMessage[messageLocation] === ".") {
	        console.log("instruction: send dit");
	        sendDit()
	    } else if (theMessage[messageLocation] === "-") {
	        console.log("instruction: send dah");
	        sendDah()
	    } else {
	        console.log("instruction: send space");
	        sendSpace()
	    }
	    messageLocation++
	}

	function sendDit() {
        app.morsers.me.keyDown();
        setTimeout(function() {
            app.morsers.me.keyUp();
            setTimeout(sendCharacter, 1*unitLength);
        }, 1*unitLength);
	}

	function sendDah() {
        app.morsers.me.keyDown();
        setTimeout(function() {
            app.morsers.me.keyUp();
            setTimeout(sendCharacter, 1*unitLength);
        }, 3*unitLength);
	}

	function sendSpace() {
	    setTimeout(sendCharacter, 1*unitLength);
	}
	const morseTextDict = {
	    "a": ".-",
	    "b": "-...",
	    "c": "-.-.",
	    "d": "-..",
	    "e": ".",
	    "f": "..-.",
	    "g": "--.",
	    "h": "....",
	    "i": "..",
	    "j": ".---",
	    "k": "-.-",
	    "l": ".-..",
	    "m": "--",
	    "n": "-.",
	    "o": "---",
	    "p": ".--.",
	    "q": "--.-",
	    "r": ".-.",
	    "s": "...",
	    "t": "-",
	    "u": "..-",
	    "v": "...-",
	    "w": ".--",
	    "x": "-..-",
	    "y": "-.--",
	    "z": "--..",
	    "0": "-----",
	    "1": ".----",
	    "2": "..---",
	    "3": "...--",
	    "4": "....-",
	    "5": ".....",
	    "6": "-....",
	    "7": "--...",
	    "8": "---..",
	    "9": "----.",
	    ".": ".-.-.-",
	    ",": "--..--",
	    ":": "---...",
	    "?": "..--..",
	    "'": ".----.",
	    "-": "-....-",
	    "/": "-..-.",
	    "\"": ".-..-.",
	    "@": ".--.-.",
	    "=": "-...-",
	    "!": "---.",
	    " ": "/////"
	};

	$("#customSendButton").click(function(e)
	{
		sendMessage($("#customMessageTextarea").val().toLowerCase());
		$("#customMessageTextarea").val("");
	});

	$("#customPeriodButton").click(function(e)
	{
		periodEnabled = !periodEnabled;
		$("#customPeriodButton").css("color", periodEnabled ? "green" : "red");
	});

	$("#customWelcomeButton").click(function(e)
	{
		welcomeEnabled = !welcomeEnabled;
		$("#customWelcomeButton").css("color", welcomeEnabled ? "green" : "red");
	})

	$(document).keydown(function(e)
	{
		if (e.which == 13)
		{
			$("#customSendButton").click();
			e.preventDefault();
		}

		if (e.which == 190)
		{
			if (!periodEnabled) { return; }
			app.morsers.me.keyDown();
		}
	});

	$(document).keyup(function(e)
	{
		if (e.which == 190)
		{
			if (!periodEnabled) { return; }
			app.morsers.me.keyUp();
		}
	})

	$("#customWpmInput").change(function(e)
	{
		let val = $(this).val()
		if (val!=null && val!=undefined)
		{
			setUnitLength(parseInt(val));
		}
	});

	$("#customWpmInput").focus(function(e)
	{
		$(this).select();
	});
})();