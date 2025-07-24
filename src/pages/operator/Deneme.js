import React, { useEffect, useState } from "react";
//import signalR from "@microsoft/signalr/dist/browser/signalr.min.js";

const Deneme = () => {
    console.log("merhabalar denemeden");
    //const [messages, setMessages] = useState({});
    var message = "bir mesaj bekliyorum.";


    const signalR = require('@microsoft/signalr');
    let connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5031/myHub?workorderId=7&workstationId=7")
    .build();

    
    connection.on("Greetings", data => {
    		message = data;
            console.log("Someone called Greetings, data:" + data);
    });


    //functions
    const foo1 = () => {
        connection.invoke("SayHi", "react");
        console.log("foo1 cagirildi");
    };


    connection.start();

    return (
        <>

            <p>Messages</p>
            <p>{message}</p>
            <button onClick={() => foo1()} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
               Say Hi to Server
            </button>
        
        </>
    );
};

export default Deneme;