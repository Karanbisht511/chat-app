import { useEffect } from "react";
import { socket } from "../socket";
// import { Link } from 'react-router';
import FriendList from "./FriendList";
import { Outlet } from "react-router";
import "./Chatpage.css";
import { useSelector } from "react-redux";
import { RootState } from "../stateManagement/store";
import { useAppDispatch } from "../utils/utils";
import { dashboard } from "../stateManagement/Dashboard/dashboardSlice";
import RemoveParticipants from "./PopUps/RemoveParticipants";

function Chatpage() {
  const dispatch = useAppDispatch();
  const loginDetails = useSelector(
    (state: RootState) => state.login.loginState.response
  );
  console.log("loginDetails:", loginDetails);
  const dashboardDetails = useSelector(
    (state: RootState) => state.dashboard.response
  );
  const username = sessionStorage.getItem("username");
  const newChatAdded = useSelector(
    (state: RootState) => state.addNewChat.status
  );
  const removePartPopup = useSelector(
    (state: RootState) => state.contextMenu.removeParticipantsPopup
  );

  useEffect(() => {
    dispatch(dashboard());
    socket.on("connect", () => {
      console.log("Connected to socket server. Socket ID:", socket.id);
      // setIsConnected(true);
    });

    const user = sessionStorage.getItem("username");
    if (typeof user !== null) {
      console.log("when user login event triggered");
      console.log("socket:", socket);

      socket.emit("When user login", user);
      console.log("when user login event completed");
    }

    return () => {
      socket.disconnect();
    };
  }, [dispatch, username, newChatAdded]);

  return (
    <div>
      {/* <div>Header</div> */}
      <div className="chatpage-container h-screen">
        {removePartPopup && <RemoveParticipants />}
        <div
          className="chatList-wrapper chatList-width"
          style={{ border: "2px solid black" }}
        >
          {dashboardDetails && (
            <FriendList
              friendList={dashboardDetails.friendList}
              users={dashboardDetails.users}
              groups={dashboardDetails.groups}
            />
          )}{" "}
        </div>
        <div
          className="chatBox-wrapper chatBox-width"
          style={{ border: "2px solid black" }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Chatpage;
