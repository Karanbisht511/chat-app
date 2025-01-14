import { FC } from 'react'
import { useAppDispatch } from '../../utils/utils'
import { addNewChat } from '../../stateManagement/Dashboard/dashboardSlice'
import { toggleAddGroupMember } from '../../stateManagement/PopupContexts/PopupContext'
import './popups.css'
import ProfileIcon from '../Icons/ProfileIcon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
import Search from '../Search'

interface IUserList {
    users: string[]
}

const UserList: FC<IUserList> = ({ users }) => {

    const dispatch = useAppDispatch();

    return (
        <div className="userList-wrapper text-sm">
            <div className='text-center'>New chat</div>
            <Search />
            <div className='contact' style={{ padding: '7px', borderRadius: '10px' }}> <FontAwesomeIcon icon={faUserGroup} />  <button onClick={() => { dispatch(toggleAddGroupMember()) }}> New group</button></div>
            <div style={{ margin: '10px' }}><span>Contacts</span></div>
            <div className='contacts-wrapper'>
                {users.length > 0 ? users.map((e: string) => {
                    if (e !== null)
                        return <div onClick={() => {
                            dispatch(addNewChat(e));
                        }}> <div className='contact'>
                                <ProfileIcon />
                                <span>{e}</span>
                            </div></div>
                }) : 'No Contacts'}
            </div>
        </div>
    )
}

export default UserList