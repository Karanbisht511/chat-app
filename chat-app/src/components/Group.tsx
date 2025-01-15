import { FC, useEffect } from "react";
import ProfileIcon from "./Icons/ProfileIcon";
import { Link } from "react-router";
import { useAppDispatch } from "../utils/utils";
import { toggleGroupContext } from "../stateManagement/PopupContexts/PopupContext";
import { useSelector } from "react-redux";
import { RootState } from "../stateManagement/store";
import { toggleRemoveParticpantsPopup } from "../stateManagement/PopupContexts/PopupContext";
import { removePart } from "../stateManagement/Groups/GroupSlice";

interface Ifriend {
  groupName: string;
  index: number;
}

const Group: FC<Ifriend> = ({ groupName, index }) => {
  const dispatch = useAppDispatch();

  const showContextMenu = useSelector(
    (state: RootState) => state.contextMenu.groupContextArr[index]
  );

  const chatListElement: HTMLElement =
    document.querySelector(".chatList-wrapper")!;
  const chatBoxElement: HTMLElement =
    document.querySelector(".chatBox-wrapper")!;
    const contextMenu: HTMLElement = document.querySelector(".context-menu")!;

  useEffect(() => {

    window.addEventListener("scroll", () => {
      const position = contextMenu.getBoundingClientRect();
      console.log("position:", position);

      const scrollY: number = window.scrollY;
      contextMenu.style.top = `${position.top + scrollY}`;
    });
  }, [window.scroll]);

  const handleContextState = () => {
    const payload = {
      index,
    };
    dispatch(toggleGroupContext(payload));
  };

  const handleRemoveParticipant = () => {
    dispatch(toggleRemoveParticpantsPopup());
    dispatch(removePart({ groupName }));
  };

  const handleScreenSize = () => {
    console.log(window.innerHeight);

    if (window.innerWidth < 650) {
      chatListElement.style.display = "none";
      chatBoxElement.style.display = "block";
    }
  };

  return (
    <div className="user">
      <Link
        to={`/message/${groupName}`}
        state={{ isGroup: false }}
        key={groupName}
        onClick={handleScreenSize}
      >
        <div>
          <ProfileIcon />
          <span>{groupName}</span>
        </div>
      </Link>
      <div>
        <div className="context-menu-button">
          <button onClick={handleContextState}>&#8942;</button>
          {showContextMenu && (
            <div className="context-menu">
              <ol>
                <li onClick={handleRemoveParticipant}>Delete chat</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Group;
