import io from "socket.io-client";
import {useEffect, useState} from 'react'

export function useWs(){
	const [ rs, setRs ] = useState(0);
    const [ ws, setWs] = useState(null);  

    const heartbeat = async (ws) => { 		
		setTimeout(
		    function() {
				//console.log(ws.readyState);
				/*  0 	CONNECTING 	Socket has been created. The connection is not yet open.
					1 	OPEN 	The connection is open and ready to communicate.
					2 	CLOSING 	The connection is in the process of closing.
					3 	CLOSED 	The connection is closed or couldn't be opened.	
				*/	
				if(rs !== ws.readyState) {	    
					setRs(ws.readyState)			
			    }
		        heartbeat(ws);
		    }
		    .bind(this),
		    1000
		);
    }

    const configureWebsocket = async() => {
		ws.onopen = function(open_event) {	
			ws.onmessage = function(event) {
                // s = JSON.parse(s)
                // console.log(s)
                var data = JSON.stringify(event.data)
                var xd =  data.substring(1, data.length -1)
                // var letter = /^[a-ZA-Z]+$/
                console.log(xd)
                var info = []
                for (i = 0; i<xd.length; i++){
                    temp_str = ""
                    while (i + 1<xd.length && xd.charAt(i).match(/[a-zA-Z]/i)) {
                        temp_str += xd.charAt(i)
                        i += 1
                    }
                    if(temp_str) {
                        info.push(temp_str)
                    }
                }
                jsonData = {}
                jsonData[info[0]] = info[1]
                jsonData[info[2]] = info[3]
                
				switch(jsonData['Message']) {
                    case 'Boiling':
                        console.log("Ya yeet")
					default:
                        console.log("WTF")
						break;
				}
			}
			ws.onclose = function(close_event) {
				console.log(close_event);
			}
			ws.onerror = function(error_event) {
				console.log(error_event);
			}
		}		
	}	
        
    useEffect(() => {		
		if(ws === null) { setWs(new WebSocket('ws://192.168.0.100:12345')); }
		if(ws !== null && rs === 0 ) { configureWebsocket(); heartbeat(ws); }		
	},[ws,rs])

    return {
        ws,
        setWs,
        rs,
        setRs
    }
}