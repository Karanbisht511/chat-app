import { useEffect, useState } from 'react'
import { socket } from '../socket'
// import { Link } from 'react-router';
import FriendList from './FriendList'
import { Outlet } from 'react-router';
import './Chatpage.css'
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../stateManagement/store';

function Chatpage() {
  // const [isConnected, setIsConnected] = useState(socket.connected);
  const [friendList, setFriendList] = useState<Array<string>>();
  const [allUsers, setAllusers] = useState<Array<string>>([]);
  const loginDetails = useSelector((state: RootState) => state.login.loginDetails)
  console.log("loginDetails:", loginDetails);


  useEffect(() => {
    getDashBoardDetails();
    socket.on('connect', () => {
      console.log("Connected to socket server. Socket ID:", socket.id);
      // setIsConnected(true);
    });

    const user = sessionStorage.getItem('username');
    if (typeof user !== null) {
      console.log('when user login event triggered');
      console.log("socket:", socket);

      socket.emit('When user login', user);
      console.log('when user login event completed');
    }

    return () => {
      socket.disconnect();
    };

  }, [])

  async function getDashBoardDetails() {
    const token = sessionStorage.getItem("JWTToken");
    const username = sessionStorage.getItem("username")
    try {
      const res = await axios.get(`http://localhost:9000/api/users/dashboard?username=${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("res:", res);

      setFriendList(res.data?.friendList);
      setAllusers(res.data?.users)
    } catch (error) {
      console.log("error:", error);

    }
  }

  return (
    <div className='chatpage-container flex h-screen' >
      <div className='w-1/4' style={{ border: '2px solid black' }}>{friendList && <FriendList friendList={friendList} users={allUsers} />} </div>
      <div className='w-10/12' style={{ border: '2px solid black' }} ><Outlet /></div>
    </div>
  )
}

export default Chatpage
