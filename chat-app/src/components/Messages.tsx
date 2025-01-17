import { SyntheticEvent, useEffect, useState, ChangeEvent } from "react";
import { useParams } from "react-router";
import { socket } from "../socket";
import "./Chats.css";
import { RootState } from "../stateManagement/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../utils/utils";
import { chatHistory } from "../stateManagement/Messages/messagesSlice";
import ProfileIcon from "./Icons/ProfileIcon";
import { useLocation } from "react-router";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cleanUpChat } from "../stateManagement/Messages/messagesSlice";
import {
  faMicrophone,
  faFaceSmile,
  faPaperclip,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { toggleEmotePopup } from "../stateManagement/PopupContexts/PopupContext";
import axios from "axios";

export interface IoldMsgs {
  msg: string;
  msgBy: string;
  timeStamp: string;
}

export const Messages = () => {
  const dispatch = useAppDispatch();
  const { indexName } = useParams();
  const { isGroup } = useLocation().state;

  console.log("indexName:isGroup", indexName, isGroup);

  const username = sessionStorage.getItem("username");
  console.log("username:", username);
  const [msg, setMsg] = useState<string>("");
  const [oldMsgs, setOldMsgs] = useState<Array<IoldMsgs>>();
  const [viewSendButton, setViewButton] = useState<boolean>(false);
  const messageHistory = useSelector(
    (state: RootState) => state.chatHistory.messages
  );
  const showEmotePicker = useSelector(
    (state: RootState) => state.contextMenu.emojiBoxPopup
  );

  const chatListElement: HTMLElement =
    document.querySelector(".chatList-wrapper")!;
  const chatBoxElement: HTMLElement =
    document.querySelector(".chatBox-wrapper")!;

  useEffect(() => {
    console.log("--hitting the oneOone useEffect--");
    if (indexName) {
      dispatch(cleanUpChat());
      dispatch(chatHistory({ indexName, isGroup }));
    }

    if (isGroup) {
      console.log("isGroup:indexName", isGroup, indexName);
      console.log("Joining the group chat");
      socket.emit("join-room", indexName);
    }

    socket.on("--receive message--", ({ message, from }) => {
      console.log("---------receive message--------");
      console.log("from:", from);
      console.log("message:", message);

      let newDiv = document.createElement("div");
      newDiv.classList.add("message");
      newDiv.classList.add("left");
      let newSpan = document.createElement("span");
      newSpan.classList.add("text-content");
      newSpan.style["borderRadius"] = "10px 10px 10px 0px";
      if (message) newSpan.textContent = message;

      newDiv.appendChild(newSpan);

      const messagesContainer = document.getElementById("messages");
      messagesContainer?.appendChild(newDiv);
      if (messagesContainer)
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }, [dispatch, indexName]);

  useEffect(() => {
    if (messageHistory) {
      setOldMsgs(messageHistory);
    }
    console.log("messageHistory", messageHistory);
  }, [messageHistory]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    const fileSelector: HTMLInputElement =
      document.querySelector(".input-file")!;
    fileSelector?.addEventListener("change", () => {
      console.log("file detected");

      const file: File = fileSelector.files! && fileSelector.files[0]!;
      if (file) {
        console.log("file:", file);
        uploadFile(file);
      }
    })!;
  }, []);

  const uploadFile = async (file: File) => {
    console.log('uploadFile->file:',file);
    const formData = new FormData();
    formData.append("file", file);
    const result = await axios.post(
      "http://localhost:9000/api/messages/uploadFile",
      { formData },
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("JWTToken")}`,
        },
      }
    );
    console.log("upload result:", result);
  };

  const sendMessage = (e: SyntheticEvent) => {
    e.preventDefault();
    console.log("triggered sendMEssage function");
    const data = { message: msg, from: username, toSend: indexName, isGroup };
    console.log("data:", data);
    console.log("is socket active:", socket.active);

    socket.emit("chat message", data);
    console.log("chat message event emitted");

    let newDiv = document.createElement("div");
    newDiv.classList.add("message");
    newDiv.classList.add("right");
    let newSpan = document.createElement("span");
    newSpan.classList.add("text-content");
    newSpan.style["borderRadius"] = "10px 10px 0px 10px";
    if (msg) newSpan.textContent = msg;

    newDiv.appendChild(newSpan);

    const messagesContainer = document.getElementById("messages");
    messagesContainer?.appendChild(newDiv);
    if (messagesContainer)
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

    setMsg("");
  };

  const toggleViewButton = () => {
    if (msg && msg?.length === 1) {
      setViewButton(false);
      return;
    }
    setViewButton(true);
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMsg(e.target.value);
    console.log(msg?.length);
    console.log(e.target.value);

    toggleViewButton();
  };

  const handleResize = () => {
    if (window.innerWidth > 650) {
      chatListElement.style.display = "block";
    }
  };

  const handleBackButton = () => {
    if (window.innerWidth < 650) {
      chatBoxElement.style.display = "none";
      chatListElement.style.display = "block";
    }
  };

  const handleEmoteClick = (e: EmojiClickData) => {
    setMsg((prevState: string) => {
      if (prevState) {
        return prevState + e.emoji;
      } else {
        return e.emoji;
      }
    });
    toggleViewButton();
  };

  const handleAttachment = () => {
    console.log("handleAttachment");
    const fileSelector: HTMLInputElement =
      document.querySelector(".input-file")!;
    // const reader = new FileReader();
    fileSelector.click();
    // fileSelector.dispatchEvent(reader());

    console.log("next to file detected");
  };

  return (
    <div id="chatbox" className="h-full">
      <div className="user-name">
        <button className="back" onClick={handleBackButton}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <ProfileIcon />
        <span>{indexName}</span>
      </div>
      <div id="messages" className="messages h-5/6">
        {oldMsgs !== undefined &&
          oldMsgs?.map((e, index) => {
            if (e.msgBy === username) {
              return (
                <div className="message right" key={index}>
                  <span
                    className="text-content"
                    style={{ borderRadius: "10px 10px 0px 10px" }}
                  >
                    {e.msg}
                  </span>
                </div>
              );
            }
            return (
              <div className="message left" key={index}>
                <span
                  className="text-content"
                  style={{ borderRadius: "10px 10px 10px 0px" }}
                >
                  {e.msg}
                </span>
              </div>
            );
          })}
      </div>
      {showEmotePicker && (
        <div className="emojis">
          <EmojiPicker
            height="100%"
            width="100%"
            theme={Theme.DARK}
            onEmojiClick={handleEmoteClick}
          />
        </div>
      )}
      <div className="text-box-container">
        <div id="text-box-wrapper" className="message-input">
          <div className="text-box">
            <input
              type="text"
              placeholder=""
              value={msg}
              onChange={handleTextChange}
            />
          </div>
          <div className="icons flex" style={{ margin: "2px" }}>
            <span className="icon">
              <input type="file" className="input-file" />
              <FontAwesomeIcon
                style={{ color: "white" }}
                icon={faPaperclip}
                onClick={handleAttachment}
              />
            </span>
            <span className="icon">
              <FontAwesomeIcon
                style={{ color: "yellow" }}
                icon={faFaceSmile}
                onClick={() => {
                  dispatch(toggleEmotePopup());
                }}
              />
            </span>
            {viewSendButton ? (
              <button type="submit" onClick={sendMessage}>
                {" "}
                <span className="icon">
                  <FontAwesomeIcon
                    style={{ color: "white" }}
                    icon={faPaperPlane}
                  />
                </span>
              </button>
            ) : (
              <button type="submit">
                {" "}
                <span className="icon">
                  <FontAwesomeIcon
                    style={{ color: "white" }}
                    icon={faMicrophone}
                  />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
