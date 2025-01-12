import { useAppDispatch } from '../utils/utils'
import { useSelector } from 'react-redux'
import { RootState } from '../stateManagement/store'
import { addNewGroup } from '../stateManagement/Groups/GroupSlice'
import { useState } from 'react'
import { toggleCreateGroupPopup } from '../stateManagement/PopupContexts/PopupContext'

const CreateGroupPopup = () => {

    const dispatch = useAppDispatch();
    const participants = useSelector((state: RootState) => state.groupContext.addPartipants.parToAdd);
    const [groupName, setGroupName] = useState<string>();

    const createGroup = () => {
        console.log('participants:', participants);

        if (groupName && Array.isArray(participants)) {
            dispatch(addNewGroup({ groupName, participants }))
        }

        dispatch(toggleCreateGroupPopup());
    }

    return (
        <div className="userList-wrapper">
            <div className='flex justify-between'>
                <div>Back</div>
                <div>New Group</div>
                <div><button onClick={createGroup}>Create</button></div>
            </div>
            <div>
                <input type="text" name="" id="" value={groupName} placeholder='Group Name' onChange={(e) => {
                    setGroupName(e.target.value)
                }} />
            </div>
            <div>
                {
                    Array.isArray(participants) && (
                        participants.length > 0 ? participants.map((e: string) => {
                            return <div>{e}</div>
                        }) : 'Check contacts first')}
            </div>
        </div>
    )
}

export default CreateGroupPopup