import { toggleRemoveParticpantsPopup } from "../../stateManagement/PopupContexts/PopupContext"
import { useAppDispatch } from "../../utils/utils"
import { removeParticipant } from "../../stateManagement/Groups/GroupSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../stateManagement/store";

const RemoveParticipants = () => {
    const dispatch = useAppDispatch();
    const groupName = useSelector((state: RootState) => state.groupContext.removeParticipant.groupName);

    const togglePopup = () => {
        dispatch(toggleRemoveParticpantsPopup());
    }

    const removePartipant = () => {
        const input = {
            groupName
        }
        dispatch(removeParticipant(input));
        togglePopup();
    }

    return (
        <div className='popup-removePart'>
            <div><span>Do want to leave group?</span></div>
            <div>
                <button onClick={removePartipant}>Yes</button>
                <button onClick={togglePopup}>No</button>
            </div>
        </div>
    )
}

export default RemoveParticipants