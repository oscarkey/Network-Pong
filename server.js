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

// imports
var http = require("http");
var path = require("path");
var fs = require("fs");

var requests = [];

var logCounter = 0;

function getLogIndex() {
	logCounter++;
	return logCounter;
}

function broadcastState(stateString) {
	// move the requests into our own private array to prevent them stacking, then delete the main copy
	var privateRequests = requests.slice(0);
	
	requests = [];
	
	// loop through and send the state to all of the queued requests
	for(var i = 0; i < privateRequests.length; i++) {
		var response = privateRequests[i].response;
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write(stateString);
		response.end();
	}
	console.log(getLogIndex() + ": broadcasted state to " + privateRequests.length + " clients");
}

function processApiRequest(request, response) {
	// when we get a request, check if it is post or get
	if(request.method == "GET") {
		// add the request to a queue to be responded to when there is a state update
		requests[requests.length] = ({request: request, response: response});
	}
	if(request.method == "POST") {
		console.log(getLogIndex() + ": got state to broadcast");
		var data = "";
		request.on("data", function(chunk) {
			// save the incoming data
			data += chunk;
		});
		request.on("end", function() {
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.write("");
			response.end();
			// broadcast the state we just received to the waiting requests
			var state = data.substring(6, data.length);
			broadcastState(state);
		});
	}
}

function processStaticFileRequest(request, response) {
	var filePath = "." + request.url;
    if (filePath == "./")
        filePath = "./index.htm";
         
    var extname = path.extname(filePath);
    var contentType = "text/html";
    switch (extname) {
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
    }
     
    path.exists(filePath, function(exists) {
     
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { "Content-Type": contentType });
                    response.end(content, "utf-8");
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
}

var server = http.createServer(function(request, response) {
	// check the url, decide if static file or api request
	if(request.url == "/api") {
		processApiRequest(request, response);
	} else {
		processStaticFileRequest(request, response);
	}
});

server.listen(80);
console.log("Now listening on 80");