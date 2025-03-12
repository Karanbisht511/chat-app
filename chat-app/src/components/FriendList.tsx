import "./FriendList.css";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserList from "./PopUps/UserList";
import Friend from "./Friend";
import { useSelector } from "react-redux";
import { RootState } from "../stateManagement/store";
import { useAppDispatch } from "../utils/utils";
import {
  toggleNewChat,
  toggleAddGroupMember,
  toggleCreateGroupPopup,
} from "../stateManagement/PopupContexts/PopupContext";
import AddGroupMembers from "./PopUps/AddGroupMembers";
import CreateGroupPopup from "./PopUps/CreateGroupPopup";
// import Group from "./Group";
import { groupCleanup } from "../stateManagement/Groups/GroupSlice";
import Search from "./Search";
import ProfileIcon from "./Icons/ProfileIcon";
import { Link } from "react-router";
import { ProfilePic } from "./Profile";
import { useEffect } from "react";
import { getImage } from "../stateManagement/Messages/file";

interface friendDetail {
  name: string;
  image?: string;
  imagePath?: string;
}

interface PList {
  friendList: friendDetail[];
  users: string[];
  groups: friendDetail[];
}

const FriendList: React.FC<PList> = ({ friendList, users, groups }) => {
  const dispatch = useAppDispatch();
  const username = sessionStorage.getItem("username");
  const showNewChatPopup = useSelector(
    (state: RootState) => state.contextMenu.newChatPopup
  );
  const showAddGroupMemberPopup = useSelector(
    (state: RootState) => state.contextMenu.addGroupMembersPopup
  );
  const showCreateGroupPopup = useSelector(
    (state: RootState) => state.contextMenu.createGroupPopup
  );
  const isProfPic = useSelector(
    (state: RootState) => state.fileContext.image.status
  );

  useEffect(() => {
    // dispatch(getImage(`${username!}.jpg`));
    dispatch(getImage(username!));
  }, [username, dispatch]);

  const handlePopup = () => {
    dispatch(groupCleanup()); //Remove add to participants from state
    if (showNewChatPopup === false) {
      dispatch(toggleNewChat());
    } else {
      if (showNewChatPopup) dispatch(toggleNewChat());

      if (showAddGroupMemberPopup) dispatch(toggleAddGroupMember());

      if (showCreateGroupPopup) dispatch(toggleCreateGroupPopup());
    }
  };

  return (
    <div className="chatList h-full">
      <div className="user-name flex justify-between items-center">
        <div className="flex justify-between items-center">
          <span>
            {" "}
            <Link to="/profile">
              <div className="h-[40px] w-[40px] rounded-full">
                {isProfPic !== "success" ? <ProfileIcon /> : <ProfilePic />}
              </div>
            </Link>
          </span>{" "}
        </div>
        <div>
          {" "}
          <span>Chats</span>
        </div>
        <div>
          {" "}
          <button onClick={handlePopup}>
            {" "}
            <FontAwesomeIcon icon={faPenToSquare} />{" "}
          </button>
        </div>
      </div>
      {showNewChatPopup && <UserList users={users} />}
      {showAddGroupMemberPopup && <AddGroupMembers users={users} />}
      {showCreateGroupPopup && <CreateGroupPopup />}
      <Search />
      <div id="friends-list">
        <div className="users-wrapper">
          {friendList.length > 0
            ? friendList.map((e: friendDetail, index: number) => {
                console.log("e:", e);

                return (
                  <Friend
                    userName={e.name}
                    image={e.image!}
                    index={index}
                    key={index}
                  />
                );
              })
            : "No Active Friends"}
        </div>

        <div className="user-name">
          <h1>Groups</h1>
        </div>
        <div className="group-wrapper">
          {groups.length > 0
            ? groups.map((e: friendDetail, index: number) => {
                return (
                  <Friend
                    userName={e.name}
                    image={e.image!}
                    index={index}
                    key={index}
                    isGroup={true}
                  />
                );
              })
            : "No Groups"}
        </div>
      </div>
    </div>
  );
};

export default FriendList;
