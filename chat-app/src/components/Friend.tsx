import { FC } from 'react'
import ProfileIcon from './Icons/ProfileIcon';
import { Link } from 'react-router';
import { useAppDispatch } from '../utils/utils';
import { deleteChat } from '../stateManagement/Dashboard/dashboardSlice';
import { toggleChatContext } from '../stateManagement/PopupContexts/PopupContext';
import { useSelector } from 'react-redux';
import { RootState } from '../stateManagement/store';

interface Ifriend {
    userName: string,
    index: number
}

const Friend: FC<Ifriend> = ({ userName, index }) => {

    const dispatch = useAppDispatch();

    const showContextMenu = useSelector((state: RootState) => state.contextMenu.chatContextArr[index])

    const handleContextState = () => {

        const payload = {
            index,
        }
        dispatch(toggleChatContext(payload));
    }

    const handleScreenSize = () => {
        console.log(window.innerHeight);
        const chatListElement: HTMLElement = document.querySelector('.chatList-wrapper')!;
        // const chatBoxElement: HTMLElement = document.querySelector('.chatBox-wrapper')!;
        if (window.innerWidth < 650) {
            chatListElement.style.display = 'none';
            // chatBoxElement.style.display = 'block';
        }
    }

    return (
        <div className='user'>
            <Link to={`/message/${userName}`} state={{ isGroup: false }} key={userName} onClick={handleScreenSize}>
                <div>
                    <ProfileIcon />
                    <span>{userName}</span>
                </div>
            </Link>
            <div >
                <div className='context-menu-button'>
                    <button onClick={handleContextState}>&#8942;</button>
                    {showContextMenu &&
                        (
                            <div className='context-menu'>
                                <ol>
                                    <li onClick={() => { dispatch(deleteChat(userName)) }}>Delete chat</li>
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

export default Friend