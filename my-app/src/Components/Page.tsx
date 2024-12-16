import React, { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client';
import "./Styles.css"
import axios from 'axios';

const SOCKET_SERVER_URL = "http://localhost:9000";

export default function Page() {

    const [message, setMessage] = useState("");
    const [receivedMessage, setReceivedMessage] = useState({ message: '', count: '' });
    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("")
    const [to, setTo] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false)
    const [active, setActives] = useState<any[]>([]);

    const [socket, setSocket] = useState<Socket | null>(null);
    // const [connected, setConnected] = useState(false);



    const establishConnnetion = () => {

        const socket = io(SOCKET_SERVER_URL);
        setSocket(socket);

        socket.on('connect', () => {
            console.log(`connected to ${user}:${socket.id}`);
            
            socket.emit('When user login', user)
            // setConnected(true)
        })

        // Listen for messages from the server
        socket.on("chat message", (data) => {
            console.log(data);
            setReceivedMessage(data);
            var messages = document.getElementById('messages');
            if (messages) {
                var item = document.createElement('li');
                item.classList.add()
                item.textContent = message;
                messages.appendChild(item);
            }
        });

        socket.on('active users', (data) => {
            console.log("data", data);

            setActives((prev) => [...prev, ...data.map((e: any) => e?.username)]);
            console.log('active:', active);
        })
        socket.on('undelivered messages',(data)=>{
            console.log("undelivered messages", data);

        })
    }


    const disconnect = () => {
        if (socket) {
            socket.disconnect();
            // setConnected(false);
        }

    }

    const sendMessage = () => {
        const socket = io(SOCKET_SERVER_URL);
        socket.emit("chat message", { message: message, from: user, toSend: to });
        setMessage("");

        var messages = document.getElementById('messages');
        if (messages) {
            var item = document.createElement('li');
            item.textContent = receivedMessage.message;
            messages.appendChild(item);
        }
    };

    const login = async () => {
        const loginStatus = await axios.post(`${SOCKET_SERVER_URL}/api/users/login`, { username: user, password: pwd });
        console.log(`loginStatus:${loginStatus.data?.success}`);
        setLoginSuccess(loginStatus.data?.success);
    }

    return (
        <div>
            <h1>Socket.IO in React</h1>
            <div>
                <div>
                    <span>username: </span>
                    <input type="text"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        placeholder="User" />
                    <span>Password: </span>
                    <input type="password"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        placeholder="User" />
                </div>
                <button onClick={login}>login</button>
            </div>

            <div> {(!loginSuccess) ? 'login' : 'login Success'} </div>

            <button onClick={establishConnnetion}>connect Socket</button>
            <button onClick={disconnect}>Disconnect</button>
            <div>
                <span>To: </span>
                <input type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="User" />
            </div>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />

            <div id='messages'>
                <p>Send message:{message}</p>
                <p>Received Message: {receivedMessage.message}</p>

            </div>

            <button onClick={sendMessage}>Send Message</button>

            <div>{(active.length > 0) ? (active.map((e) => {
                console.log(e);

                return <li>{e}</li>
            })) : 'no active users'}</div>
        </div>
    )
}
