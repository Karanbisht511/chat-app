import { FC } from 'react'
import { useAppDispatch } from '../utils/utils'
// import { addNewChat } from '../stateManagement/Dashboard/dashboardSlice'
import { addParticipants } from '../stateManagement/Groups/GroupSlice'
import { toggleCreateGroupPopup } from '../stateManagement/PopupContexts/PopupContext'

interface IUserList {
    users: string[]
}

const AddGroupMembers: FC<IUserList> = ({ users }) => {

    const dispatch = useAppDispatch();

    return (
        <div className="userList-wrapper">
            <div className='flex justify-between'>
                <div>back</div>
                <div> Add Group Members</div>
                <div><button onClick={() => { dispatch(toggleCreateGroupPopup()) }}>Next</button></div>
            </div>
            <div>Search</div>
            <div>Contacts</div>
            <div>
                {users.length > 0 ? users.map((e: string) => {
                    if (e !== null)
                        return <div className='flex'>
                            <div><span>{e}</span></div>
                            <div><input onChange={() => {
                                dispatch(addParticipants({ participant: e }))
                            }} type="checkbox" name="toAdd" id="" /></div>
                        </div>
                }) : 'No Contacts'}
            </div>
        </div>
    )
}

export default AddGroupMembers