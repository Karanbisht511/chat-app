import { FC } from 'react'
import { useAppDispatch } from '../../utils/utils'
import { addParticipants } from '../../stateManagement/Groups/GroupSlice'
import { toggleCreateGroupPopup, toggleNewChat } from '../../stateManagement/PopupContexts/PopupContext'
import Search from '../Search'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import ProfileIcon from '../Icons/ProfileIcon'

interface IUserList {
    users: string[]
}

const AddGroupMembers: FC<IUserList> = ({ users }) => {

    const dispatch = useAppDispatch();

    return (
        <div className="userList-wrapper text-sm">
            <div className='flex justify-between items-center'>
                <div><button onClick={() => { dispatch(toggleNewChat()) }}><FontAwesomeIcon icon={faArrowLeft} /></button></div>
                <div> Add members</div>
                <div><button onClick={() => { dispatch(toggleCreateGroupPopup()) }}>Next</button></div>
            </div>
            <Search />
            <div style={{ margin: '10px', color: '#8A8888' }}><span>Frequently contacted</span></div>
            <div>
                {users.length > 0 ? users.map((e: string) => {
                    if (e !== null)
                        return <div className='flex justify-between items-center contact'>
                            <div>
                                <ProfileIcon />
                                <span>{e}</span>
                            </div>
                            <div>
                                <input onChange={() => {
                                    dispatch(addParticipants({ participant: e }))
                                }} type="checkbox" name="toAdd" id="" />
                            </div>
                        </div>
                }) : 'No Contacts'}
            </div>
        </div>
    )
}

export default AddGroupMembers