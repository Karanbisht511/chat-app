import { useAppDispatch } from '../../utils/utils'
import { useSelector } from 'react-redux'
import { RootState } from '../../stateManagement/store'
import { addNewGroup } from '../../stateManagement/Groups/GroupSlice'
import { useState } from 'react'
import { toggleCreateGroupPopup, toggleAddGroupMember } from '../../stateManagement/PopupContexts/PopupContext'
import { dashboard } from '../../stateManagement/Dashboard/dashboardSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera } from '@fortawesome/free-solid-svg-icons'

const CreateGroupPopup = () => {

    const dispatch = useAppDispatch();
    const participants = useSelector((state: RootState) => state.groupContext.addPartipants.parToAdd);
    const [groupName, setGroupName] = useState<string>();

    const createGroup = () => {
        console.log('participants:', participants);

        if (groupName && Array.isArray(participants)) {
            dispatch(addNewGroup({ groupName, participants }))
            dispatch(dashboard())
        }
        dispatch(toggleCreateGroupPopup());
    }

    return (
        <div id='createGroup' className="userList-wrapper text-sm">
            <div className='flex justify-between'>
                <div><button onClick={() => { dispatch(toggleAddGroupMember()) }}>Back</button> </div>
                <div>New group</div>
                <div><button onClick={createGroup}>Create</button></div>
            </div>

            <div className='flex justify-between items-center group-name'>
                <div className='camera-icon-wrapper'><FontAwesomeIcon icon={faCamera} /></div>
                <div>  <input type="text" name="" id="" value={groupName} placeholder='Group name' onChange={(e) => {
                    setGroupName(e.target.value)
                }} />
                </div>
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
