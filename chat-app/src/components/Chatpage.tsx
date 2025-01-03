import { useEffect, useState } from 'react'
import { socket } from '../socket'
// import { Link } from 'react-router';
import FriendList from './FriendList'
import { Outlet } from 'react-router';
import './Chatpage.css'
import { useSelector } from 'react-redux';
import { RootState } from '../stateManagement/store';
import { useAppDispatch } from '../utils/utils';
import { dashboard } from '../stateManagement/Dashboard/dashboardSlice';

function Chatpage() {
  const dispatch = useAppDispatch();
  // const [isConnected, setIsConnected] = useState(socket.connected);
  const [friendList, setFriendList] = useState<Array<string>>();
  const [allUsers, setAllusers] = useState<Array<string>>([]);
  const loginDetails = useSelector((state: RootState) => state.login.loginDetails)
  console.log("loginDetails:", loginDetails);
  const dashboardDetails = useSelector((state: RootState) => state.dashboard.dashboard)
  const username = sessionStorage.getItem('username')

  useEffect(() => {

    dispatch(dashboard());
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

    // return () => {
    //   socket.disconnect();
    // };

  }, [dispatch, username])

  useEffect(() => {
    console.log('dashboardDetails:', JSON.stringify(dashboardDetails));

    if (dashboardDetails) {
      setFriendList(dashboardDetails.friendList || []);
      setAllusers(dashboardDetails.users || []);
    }
  }, [dashboardDetails])

  return (
    <div className='chatpage-container flex h-screen' >
      <div className='w-1/4' style={{ border: '2px solid black' }}>{friendList && <FriendList friendList={friendList} users={allUsers} />} </div>
      <div className='w-10/12' style={{ border: '2px solid black' }} ><Outlet /></div>
    </div>
  )
}

export default Chatpage
