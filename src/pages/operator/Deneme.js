//import React, { useEffect, useState } from "react";
//import axios from "axios";
//import signalR from "@microsoft/signalr/dist/browser/signalr.min.js";

const Deneme = () => {
    console.log("merhabalar denemeden");
    //const [messages, setMessages] = useState({});
    var message = "bir mesaj bekliyorum.";

    //----------------------SignalR------------------------------------------
    //const signalR = require('@microsoft/signalr');
    //let connection = new signalR.HubConnectionBuilder()
    //.withUrl("http://localhost:5031/myHub?workorderId=7&workstationId=7")
    //.build();


    //connection.on("Greetings", data => {
    //		message = data;
    //        console.log("Someone called Greetings, data:" + data);
    //});


    ////functions
    //const foo1 = () => {
    //    connection.invoke("SayHi", "react");
    //    console.log("foo1 cagirildi");
    //};


    //connection.start();
    //-------------------------------------------------------

    //-------------axios-------------------------------------------
    //axios istegine token headerý eklemeyi deneme
    //const res = axios.get("http://localhost:5031/Authenticate/operator",
    //    {
    //        headers: {
    //            "Authorization": "Bearer " + localStorage.getItem("token")
    //    }});


    return (
        <>

            <p>Messages</p>
            <p>{message}</p>
        
        </>
    );
};

export default Deneme;