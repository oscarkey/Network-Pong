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
	GAME_DIV_ID = "gameDiv";
	MENU_DIV_ID = "menuDiv";
	pong.GREEN_COLOR = "00ff00";
	pong.BLACK_COLOR = "000000";

	pong.onLoad = function() {
		// check if we support this browser
		if (pong.game.checkCompatibility()) {
			// show an error message
			// TODO nice error message
			alert("Sorry, your browswer is not supported");
			return; // exit here
		}

		// show the menu
		showMenu();
	}

	pong.connectAndStart = function(address, screenNo, totalScreens) {
		// create the game
		pong.game.createGame(screenNo, totalScreens);
		
		// connect to the server
		pong.network.serverUrl = address + "/api";
		pong.network.updateReceiver = pong.game.receiveGameState;
		pong.network.beginListening();
		
		// show the game and start the game
		showGame();
		pong.game.startGame();
	}

	function showGame() {
		document.getElementById(GAME_DIV_ID).style.display = "block";
		document.getElementById(MENU_DIV_ID).style.display = "none";
	}

	function showMenu() {
		document.getElementById(GAME_DIV_ID).style.display = "none";
		document.getElementById(MENU_DIV_ID).style.display = "block";
	}
}(window.pong = window.pong || {}));