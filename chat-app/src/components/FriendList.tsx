import { Link } from 'react-router';
import './FriendList.css'
import ProfileIcon from './ProfileIcon';
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserList from './UserList';
import Friend from './Friend';
import { useSelector } from 'react-redux';
import { RootState } from '../stateManagement/store';
import { useAppDispatch } from '../utils/utils';
import { toggleNewChat } from '../stateManagement/PopupContexts/PopupContext';

interface PList {
  friendList: string[];
  users: string[]
}

const FriendList: React.FC<PList> = ({ friendList, users }) => {
  const dispatch = useAppDispatch();
  const showNewChatPopup = useSelector((state: RootState) => state.contextMenu.newChatPopup)

  return (
    <div className='chatList h-full'>
      <div className='user-name flex justify-between'><div><span>Chats</span></div><div> <button onClick={() => { dispatch(toggleNewChat()) }}> <FontAwesomeIcon icon={faPenToSquare} /> </button></div></div>
      {showNewChatPopup && <UserList users={users} />}
      <div className='user'><input type="text" name="" id="" placeholder='Search' style={{ border: '2px solid black' }} /></div>
      <div className='users-wrapper'>
        {friendList.length > 0 ? friendList.map((e: string, index: number) => {
          return <Friend userName={e} index={index} key={index} />
        }) : "No Active Friends"}
      </div>

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
