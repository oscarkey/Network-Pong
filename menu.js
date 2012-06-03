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
	// create the menu namespace
	pong.menu = {};

	pong.menu.showPosition = function() {
		var value = document.getElementById("screenNo").value;
		document.getElementById("positionDisplay").innerHTML = value;
	}

	pong.menu.screenNum = function() {
		var value = document.getElementById("totalScreens").value;
		document.getElementById("numScreens").innerHTML = value;
	}

	pong.menu.onConnectClick = function() {
		pong.connectAndStart(document.getElementById("addressInput").value,document.getElementById("screenNo").value,document.getElementById("totalScreens").value);
		
	}
	
	

}(window.pong = window.pong || {}));