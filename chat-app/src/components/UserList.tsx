import { FC } from 'react'
import { useAppDispatch } from '../utils/utils'
import { addNewChat } from '../stateManagement/Dashboard/dashboardSlice'
import { toggleAddGroupMember } from '../stateManagement/PopupContexts/PopupContext'

interface IUserList {
    users: string[]
}

const UserList: FC<IUserList> = ({ users }) => {

    const dispatch = useAppDispatch();

    return (
        <div className="userList-wrapper">
            <div>NewChat</div>
            <div>Search</div>
            <div> <button onClick={() => { dispatch(toggleAddGroupMember()) }}> New group button</button></div>
            <div>Contacts</div>
            <div>
                {users.length > 0 ? users.map((e: string) => {
                    if (e !== null)
                        return <div onClick={() => {
                            dispatch(addNewChat(e));
                        }}>{e}</div>
                }) : 'No Contacts'}
            </div>
        </div>
    )
}

export default UserList