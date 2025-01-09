import { FC } from 'react'
import ProfileIcon from './ProfileIcon';
import { Link } from 'react-router';
import { useAppDispatch } from '../utils/utils';
import { toggleChatContext } from '../stateManagement/PopupContexts/PopupContext';
import { useSelector } from 'react-redux';
import { RootState } from '../stateManagement/store';
import { toggleRemoveParticpantsPopup } from '../stateManagement/PopupContexts/PopupContext';
import { removePart } from '../stateManagement/Groups/GroupSlice';

interface Ifriend {
    groupName: string,
    index: number
}

const Group: FC<Ifriend> = ({ groupName, index }) => {

    const dispatch = useAppDispatch();

    const showContextMenu = useSelector((state: RootState) => state.contextMenu.chatContextArr[index])

    const handleContextState = () => {

        const payload = {
            index,
        }
        dispatch(toggleChatContext(payload));
    }

    const handleRemoveParticipant = () => {
        dispatch(toggleRemoveParticpantsPopup());
        dispatch(removePart({ groupName }))
    }

    return (
        <div className='user'>
            <Link to={`/message/${groupName}`} state={{ isGroup: false }} key={groupName}>
                <div>
                    <ProfileIcon />
                    <span>{groupName}</span>
                </div>
            </Link>
            <div >
                <div className='context-menu-button'>
                    <button onClick={handleContextState}>&#8942;</button>
                    {showContextMenu &&
                        (
                            <div className='context-menu'>
                                <ol>
                                    <li onClick={handleRemoveParticipant}>Delete chat</li>
                                    <li >Mute</li>
                                </ol>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Group
