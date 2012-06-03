/* 
* Network Pong
* Copyright 2012 Oscar Key, Jack Yuan, Will Kochanski  
*/

/* 
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function(pong, undefined) {
	// create the network namespace
	pong.network = {
		serverUrl: "",
		updateReceiver: function() {},
	};
	
	pong.network.beginListening = function() {
		// start the listening event chain
		listenForUpdates();
	}
	
	function listenForUpdates() {
		var http = new XMLHttpRequest();
		http.open("GET", pong.network.serverUrl, true);
		http.onreadystatechange = function() {
			// wait for the right kind of response
			if(http.readyState == 4) {
				if(http.status == 200) {
					// get the state object and give it to the game
					var state = JSON.parse(http.responseText);
					pong.network.updateReceiver(state);
					// listener again for updates in a few milliseconds
					setTimeout(listenForUpdates, 20);
				} else {
					alert("A problem occured whilst talking to the server");
				}
			}
		};
		
		http.send();
	}
	
	
	pong.network.sendState = function(state) {
		// turn the state into a string
		var stateString = "state=" + JSON.stringify(state);
		
		// send the string
		var http = new XMLHttpRequest();
		http.open("POST", pong.network.serverUrl, true);
		
		// send the proper header information along with the request
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.setRequestHeader("Content-length", stateString.length);
		http.setRequestHeader("Connection", "close");
		
		http.send(stateString);
		
		return http;
	}
}(window.pong = window.pong || {}));