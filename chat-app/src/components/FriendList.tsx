import './FriendList.css'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserList from './UserList';
import Friend from './Friend';
import { useSelector } from 'react-redux';
import { RootState } from '../stateManagement/store';
import { useAppDispatch } from '../utils/utils';
import { toggleNewChat } from '../stateManagement/PopupContexts/PopupContext';
import AddGroupMembers from './AddGroupMembers';
import CreateGroupPopup from './CreateGroupPopup';
import Group from './Group';

interface PList {
  friendList: string[];
  users: string[];
  groups: string[];
}

const FriendList: React.FC<PList> = ({ friendList, users, groups }) => {
  const dispatch = useAppDispatch();
  const showNewChatPopup = useSelector((state: RootState) => state.contextMenu.newChatPopup)
  const showAddGroupMemberPopup = useSelector((state: RootState) => state.contextMenu.addGroupMembersPopup)
  const showCreateGroupPopup = useSelector((state: RootState) => state.contextMenu.createGroupPopup)

  return (
    <div className='chatList h-full'>
      <div className='user-name flex justify-between'><div><span>Chats</span></div><div> <button onClick={() => { dispatch(toggleNewChat()) }}> <FontAwesomeIcon icon={faPenToSquare} /> </button></div></div>
      {showNewChatPopup && <UserList users={users} />}
      {showAddGroupMemberPopup && <AddGroupMembers users={users} />}
      {showCreateGroupPopup && <CreateGroupPopup />}

      <div className='user'><input type="text" name="" id="" placeholder='Search' style={{ border: '2px solid black' }} /></div>
      <div id='friends-list'>
        <div className='users-wrapper'>
          {friendList.length > 0 ? friendList.map((e: string, index: number) => {
            return <Friend userName={e} index={index} key={index} />
          }) : "No Active Friends"}
        </div>

        <div className='user-name'><h1>Groups</h1></div>
        <div className='group-wrapper'>
          {groups.length > 0 ? groups.map((e: string, index: number) => {
            return <Group groupName={e} index={index} key={index} />
          }) : "No Groups"}
        </div>
      </div>
    </div>
  )
}

export default FriendList
