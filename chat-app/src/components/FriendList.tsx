// import axios from 'axios'
// import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import './FriendList.css'
import ProfileIcon from './ProfileIcon';

interface PList {
  friendList: string[];
  users: string[]
}

const FriendList: React.FC<PList> = ({ friendList, users }) => {

  return (
    <div className='chatList h-full'>
      <div className='user-name'><h1>chats</h1></div>
      <div className='user'><input type="text" name="" id="" placeholder='Search' style={{ border: '2px solid black' }} /></div>
      <div>
        {friendList.length > 0 ? friendList.map((e: string) => {
          return <Link to={`/message/${e}`} state={{ isGroup: false }} key={e}>
            <div className='user' style={{ border: '2px solid black' }}>
              <ProfileIcon />
              <span>{e}</span>
            </div>
          </Link>
        }) : "No Active Friends"}
      </div>
      {/* <div>
        {users.length > 0 ? users.map((e: string) => { return <Link to={`/message/${e}`} key={e} ><div className='user' style={{ border: '2px solid black' }}>{e}</div></Link> }) : "No Active Friends"}
      </div> */}
      <div>
        <div className='user-name'><h1>Groups</h1></div>
        <div>
          <Link to="/message/Group1" state={{ isGroup: true }} key='1'>
            <div className='user' style={{ border: '2px solid black' }}>
              <ProfileIcon />
              <span>Group1</span>

            </div></Link>
          <Link to="/message/Group2" state={{ isGroup: true }} key='2'>
            <div className='user' style={{ border: '2px solid black' }}>
              <ProfileIcon />
              <span>Group2</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FriendList
