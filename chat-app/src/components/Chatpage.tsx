import { useEffect, useState } from 'react'
import { socket } from '../socket'
// import { Link } from 'react-router';
import FriendList from './FriendList'
import { Outlet } from 'react-router';

function Chatpage() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {

    socket.on('connect', () => {
      console.log("Connected to socket server. Socket ID:", socket.id);
      setIsConnected(true);
  });

    const user = sessionStorage.getItem('username');
    if (typeof user !== null){
      console.log('when user login event triggered');
      console.log("socket:",socket);
      
      socket.emit('When user login', user);
      console.log('when user login event completed');
    }

    return () => {
      socket.disconnect();
    };

  }, [])

  return (
    <div>
      <h1> chatpage</h1>
      <FriendList />

      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default Chatpage
