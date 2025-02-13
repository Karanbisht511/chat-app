import { useNavigate } from "react-router";
import { useAppDispatch } from "../../utils/utils";
import { resetAuth } from "../../stateManagement/Authentication/Authentication";
import { resetGroup } from "../../stateManagement/Groups/GroupSlice";
import { cleanUpFileState } from "../../stateManagement/Messages/file";
import { cleanUpChat } from "../../stateManagement/Messages/messagesSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(resetAuth());
    dispatch(resetGroup());
    dispatch(cleanUpFileState());
    dispatch(cleanUpChat());
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("JWTToken");
    navigate("/");
  };

  return (
    <div
      onClick={handleLogout}
      className="p-[10px] rounded-lg"
      style={{ backgroundColor: "#2C2C2C", color: "#FB5061" }}
    >
      logout
    </div>
  );
};

export default Logout;
