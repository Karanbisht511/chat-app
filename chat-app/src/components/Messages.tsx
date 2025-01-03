import { SyntheticEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { socket } from '../socket'
import "./Chats.css"

import { RootState } from '../stateManagement/store';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../utils/utils';
import { chatHistory } from '../stateManagement/Messages/messagesSlice';
import ProfileIcon from './ProfileIcon';

import { useLocation } from 'react-router';

export interface IoldMsgs {
    msg: string;
    msgBy: string;
    timeStamp: string;
}

export const Messages = () => {
    const dispatch = useAppDispatch();
    const { indexName } = useParams();
    const { isGroup } = useLocation().state;

    console.log('indexName:isGroup', indexName, isGroup);

    const username = sessionStorage.getItem('username')
    console.log('username:', username);
    const [msg, setMsg] = useState<string>();
    const [oldMsgs, setOldMsgs] = useState<Array<IoldMsgs>>();
    const messageHistory = useSelector((state: RootState) => state.chatHistory.messages)

    useEffect(() => {
        console.log('--hitting the oneOone useEffect--');
        if (indexName) {
            dispatch(chatHistory({ indexName, isGroup }))
        }

        if(isGroup){
            console.log('isGroup:indexName', isGroup, indexName);
            console.log('Joining the group chat');
            socket.emit('join-room', indexName);
        }

        socket.on('--receive message--', ({ message, from }) => {
            console.log('---------receive message--------');
            console.log('from:', from);
            console.log('message:', message);

            let newDiv = document.createElement('div');
            newDiv.classList.add('message')
            newDiv.classList.add('left')
            let newSpan = document.createElement('span');
            newSpan.classList.add('text-content')
            newSpan.style['borderRadius'] = '10px 10px 10px 0px';
            if (message)
                newSpan.textContent = message;

            newDiv.appendChild(newSpan);

            const messagesContainer = document.getElementById('messages');
            messagesContainer?.appendChild(newDiv)
            if (messagesContainer)
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
        })

    }, [dispatch, indexName])

    useEffect(() => {
        if (messageHistory) {
            setOldMsgs(messageHistory)
        }
        console.log('messageHistory', messageHistory);
    }, [messageHistory])

    const sendMessage = (e: SyntheticEvent) => {
        e.preventDefault();
        console.log('triggered sendMEssage function');
        const data = { message: msg, from: username, toSend: indexName, isGroup }
        console.log('data:', data);
        console.log("is socket active:", socket.active);

        socket.emit('chat message', data)
        console.log('chat message event emitted');

        let newDiv = document.createElement('div');
        newDiv.classList.add('message')
        newDiv.classList.add('right')
        let newSpan = document.createElement('span');
        newSpan.classList.add('text-content')
        newSpan.style['borderRadius'] = '10px 10px 0px 10px';
        if (msg)
            newSpan.textContent = msg;

        newDiv.appendChild(newSpan);

        const messagesContainer = document.getElementById('messages');
        messagesContainer?.appendChild(newDiv)
        if (messagesContainer)
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

        setMsg('');
    }

    return (
        <div id='chatbox' className='h-full' style={{ border: '2px solid black' }}>
            <div className='user-name'>
                <ProfileIcon />
                <span>{indexName}</span>
            </div>
            <div id='messages' className='messages h-5/6'>
                {oldMsgs !== undefined && oldMsgs?.map((e, index) => {
                    if (e.msgBy === username) {
                        return <div className='message right' key={index}><span className='text-content' style={{ borderRadius: '10px 10px 0px 10px' }}>{e.msg}</span></div>
                    }
                    return <div className='message left' key={index} ><span className='text-content' style={{ borderRadius: '10px 10px 10px 0px' }}>{e.msg}</span></div>
                })}
            </div>
            <div className='text-box-container'>
                <input type="text" name="message" value={msg} id="text-box" className='h-full' onChange={e => setMsg(e.target.value)} />
                <input type="submit" value="Send" id='send-button' className='h-full' onClick={sendMessage} />
            </div>
        </div>
    )
}
