import { useState } from "react";
import Logout from "./Authentication/Logout";
import { useAppDispatch } from "../utils/utils";
import { useSelector } from "react-redux";
import { RootState } from "../stateManagement/store";
import ProfileIcon from "./Icons/ProfileIcon";
import { profileImgUpload } from "../stateManagement/Messages/file";

const Profile = () => {
  const dispatch = useAppDispatch();
  const urName = sessionStorage.getItem("username")!;
  const [username, setUsername] = useState(urName);
  const [upload, setUpload] = useState<boolean>();

  const uploadProfilePic = () => {
    const handleChange = () => {
      const file: File = fileSelector.files! && fileSelector.files[0]!;
      if (file) {
        const input = {
          file: file,
        };
        console.log("file upload Input:", input);

        dispatch(profileImgUpload(input));
        setUpload(!upload);
      }
    };
    const fileSelector: HTMLInputElement =
      document.querySelector(".input-image")!;
    fileSelector?.removeEventListener("change", handleChange);
    fileSelector?.addEventListener("change", handleChange);
    fileSelector.click();
  };

  return (
    <div
      className="flex justify-center w-screen h-screen "
      style={{ border: "3px solid black", color: "white" }}
    >
      <div>Edit Profile</div>
      <div className="relative sm:w-[300px] md:w-[400px] lg:w-[500px] lg:h-[500px] mt-[50px] ml-auto mr-auto flex flex-col justify-start gap-[20px]">
        <div
          className="p-[10px] rounded-lg"
          style={{ backgroundColor: "#2C2C2C" }}
        >
          <div className="m-[10px]">
            <ScaleUpPic />
            <span>Enter your name and an optional profile picture</span>
          </div>
          <input
            type="file"
            className="input-image"
            style={{ display: "none" }}
          />
          <div
            className="input-image-wrapper"
            style={{ color: "#24BC62" }}
            onClick={uploadProfilePic}
          >
            Edit
          </div>
          <div className="border-x-[2px]-[#464646]">
            <input
              type="text"
              placeholder="Edit your Name"
              value={username!}
              style={{ backgroundColor: "#2C2C2C", border: "0px" }}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
        </div>

        <div style={{ color: "#959393" }}>Phone number</div>
        <div
          className="p-[10px] rounded-lg"
          style={{ backgroundColor: "#2C2C2C" }}
        >
          +91 9410972126
        </div>
        <div style={{ color: "#959393" }}>About</div>
        <div
          className="p-[10px] rounded-lg"
          style={{ backgroundColor: "#2C2C2C" }}
        >
          Hey there! I am using WhatsApp.
        </div>
        <Logout />
      </div>
    </div>
  );
};

const ScaleUpPic = () => {
  const [scaleup, setScaleup] = useState<Boolean>(false);
  const { status } = useSelector((state: RootState) => state.fileContext.image);

  if (status === "loading" || status === "failed") {
    return <ProfileIcon />;
  }

  return (
    <div
      onClick={() => {
        console.log("location:", window.location.pathname);
        if (window.location.pathname === "/profile") setScaleup(!scaleup);
      }}
      className={`${
        scaleup
          ? "absolute top-0 left-0 h-full w-full "
          : "h-[50px] w-[50px] rounded-full"
      }  `}
    >
      <ProfilePic />
    </div>
  );
};

export const ProfilePic = () => {
  const url = useSelector(
    (state: RootState) => state.fileContext.image.response
  );
  console.log("URL:", url);

  return <img src={url!} className="w-full h-full" alt="" />;
};

export default Profile;
