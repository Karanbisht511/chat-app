// import axios from 'axios'
// import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import './FriendList.css'

interface PList {
  friendList: string[];
  users:string[]
}

const FriendList: React.FC<PList> = ({friendList,users}) => {

  return (
    <div className='chatList h-full'>
      <div className='user-name'><h1>chats</h1></div>
      <div className='user'><input type="text" name="" id="" placeholder='Search' style={{border:'2px solid black'}} /></div>
      <div>
        {friendList.length > 0 ? friendList.map((e:string) => { return <Link to={`/message/${e}`} key={e}><div className='user' style={{border:'2px solid black'}}>{e}</div></Link> }) : "No Active Friends"}
      </div>
      <div>
        {users.length > 0 ? users.map((e:string) => { return <Link to={`/message/${e}`} key={e} ><div className='user' style={{border:'2px solid black'}}>{e}</div></Link> }) : "No Active Friends"}
      </div>
      <div>
      <div className='user-name'><h1>Groups</h1></div>
        <div>
          <Link to="/groupChats/Group1"><div className='user' style={{border:'2px solid black'}}>Group1</div></Link>
          <Link to="/groupChats/Group2"><div className='user' style={{border:'2px solid black'}}>Group2</div></Link>
        </div>
      </div>
    </div>
  )
}

export default FriendList
