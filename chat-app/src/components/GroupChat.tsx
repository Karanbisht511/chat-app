import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { socket } from '../socket';
import axios from 'axios';
import { IoldMsgs } from './Message';

const GroupChat = () => {

    const { groupName } = useParams();
    console.log('groupName:', groupName);
    const username = sessionStorage.getItem('username')
    console.log('username:', username);
    const [msg, setMsg] = useState<string>();
    const [oldMsgs, setOldMsgs] = useState<Array<IoldMsgs>>();


    useEffect(() => {
        console.log('--hitting the grouchat useEffect--');
        socket.emit('join-room', groupName);
        getMessageHistory();
        socket.on('---receive-room-message---', ({ from, message }) => {
            console.log('---------receive message--------');
            console.log('from:', from);
            console.log('message:', message);
            let newDiv = document.createElement('div');
            newDiv.classList.add('message')
            newDiv.classList.add('left')
            newDiv.innerHTML = `<span>${from}</span><span>${message}</span>`;
            document.querySelector('#messages')?.appendChild(newDiv);

            return () => {
                socket.off("receive-room-message");
            };
        })
    }, [groupName])

    const getMessageHistory = async () => {
        try {
            const messages = await axios.get(`http://localhost:9000/api/users/getGroupChats?index=${groupName}`, {
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

    const sendGroupMessage = () => {
        console.log('triggered sendGroupMessage function');
        socket.emit('send-room-message', { room: groupName, from: username, message: msg })
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
        <div id='chatbox' className='h-full' style={{ border: '2px solid black' }}>
            <div className='user-name'><h1>{groupName}</h1></div>
            <div id='messages' className='messages h-5/6'>
                {oldMsgs !== undefined && oldMsgs?.map((e, index) => {
                    if (e.msgBy === username) {
                        return <div className='message right' key={index} style={{ border: '2px solid black' }}><span>{e.msg}</span></div>
                    }
                    return <div className='message left' key={index} style={{ border: '2px solid black' }}> <span className='sender'>{e.msgBy}</span>:<span>{e.msg}</span></div>
                })}
            </div>
            <div className='text-box-container'>
                <input type="text" name="message" value={msg} id="text-box" className='h-full' onChange={e => setMsg(e.target.value)} />
                <input type="submit" value="Send" id='send-button' className='h-full' onClick={sendGroupMessage} />
            </div>
        </div>
    )
}

export default GroupChat