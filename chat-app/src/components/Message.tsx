import { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { socket } from '../socket'
import axios from 'axios';

interface IoldMsgs {
    msg: Array<string>;
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
    const [frd,setFrd]=useState(friend);

    useEffect(() => {
        console.log('--hitting the useEffect--');
        getMessageHistory();
        socket.on('--receive message--', ({ message, from }) => {
            console.log('---------receive message--------');
            console.log('from:', from);
            console.log('message:', message);
            let newDiv = document.createElement('div');
            newDiv.innerHTML = `<span>${from}</span>: <span>${message}</span>`;
            document.querySelector('#chats')?.appendChild(newDiv);
        })

        return () => {
            socket.off("receive message");
        };
    }, [frd])

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
        newDiv.innerHTML = `<span>me</span>: <span>${msg}</span>`;
        document.querySelector('#chats')?.appendChild(newDiv);
        setMsg('');
    }

    return (
        <div>
            <h1>{friend}</h1>

            <div id='chats'>
                { oldMsgs!==undefined && oldMsgs?.map((e,index) => {
                        return <li key={index}><span>{e.msgBy}</span>:<span>{e.msg}</span></li>
                    })}
            </div>
            <div>
                <input type="text" name="message" value={msg} id="" onChange={e => setMsg(e.target.value)} />
                <input type="submit" value="Send" onClick={sendMessage} />
            </div>

        </div>
    )
}
