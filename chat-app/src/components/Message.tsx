import { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { socket } from '../socket'
import axios from 'axios';
import "./Message.css"

export interface IoldMsgs {
    msg: string;
    msgBy: string;
    timeStamp: string;
}

export const Message = () => {
    const { friend } = useParams();
    console.log('friend:', friend);
    const username = sessionStorage.getItem('username')
    console.log('username:', username);
    const [msg, setMsg] = useState<string>();
    const [oldMsgs, setOldMsgs] = useState<Array<IoldMsgs>>();

    useEffect(() => {
        console.log('--hitting the oneOone useEffect--');
        getMessageHistory();
        socket.on('--receive message--', ({ message, from }) => {
            console.log('---------receive message--------');
            console.log('from:', from);
            console.log('message:', message);
            let newDiv = document.createElement('div');
            newDiv.classList.add('message')
            newDiv.classList.add('left')
            newDiv.innerHTML = `<span>${message}</span>`;
            document.querySelector('#messages')?.appendChild(newDiv);
        })

        return () => {
            socket.off("receive message");
            setMsg('');;
            setOldMsgs([]);
        };
    }, [friend])

    const getMessageHistory = async () => {
        const payload = { friend }
        try {
            const messages = await axios.post(`http://localhost:9000/api/users/getChats?username=${username}`, payload, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('JWTToken')}`
                }
            });
            console.log('messages:', messages.data);
            setOldMsgs(messages.data.messages)
        } catch (error) {
            console.log("error:", error);
        }
    }

    const sendMessage = () => {
        console.log('triggered sendMEssage function');
        socket.emit('chat message', { message: msg, from: username, toSend: friend, isGroupChat: false })
        let newDiv = document.createElement('div');
        newDiv.classList.add('message')
        newDiv.classList.add('right')
        newDiv.innerHTML = `<span>${msg}</span>`;
        const messagesContainer = document.getElementById('messages');
        messagesContainer?.appendChild(newDiv)
        if (messagesContainer)
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

        setMsg('');
    }

    return (
        <div id='chatbox' className='h-full' style={{border:'2px solid black'}}>
            <div className='user-name'><h1>{friend}</h1></div>
            <div id='messages' className='messages h-5/6'>
                {oldMsgs !== undefined && oldMsgs?.map((e, index) => {
                    if (e.msgBy === 'me') {
                        return <div className='message right' key={index} style={{border:'2px solid black'}}><span>{e.msg}</span></div>
                    }
                    return <div className='message left' key={index} style={{border:'2px solid black'}}><span>{e.msg}</span></div>
                })}
            </div>
            <div className='text-box-container'>
                <input type="text" name="message" value={msg} id="text-box" className='h-full' onChange={e => setMsg(e.target.value)} />
                <input type="submit" value="Send" id='send-button' className='h-full' onClick={sendMessage} />
            </div>
        </div>
    )
}
