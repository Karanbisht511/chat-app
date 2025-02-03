import { useEffect, useState, ChangeEvent } from "react";
import { useParams } from "react-router";
import { socket } from "../socket";
import "./Chats.css";
import { RootState } from "../stateManagement/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../utils/utils";
import {
  appendMessage,
  chatHistory,
} from "../stateManagement/Messages/messagesSlice";
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
import { EmojiClickData } from "emoji-picker-react";
import { toggleEmotePopup } from "../stateManagement/PopupContexts/PopupContext";
import {
  fileUpload,
  cleanUpFileState,
} from "../stateManagement/Messages/file";
import {
  MessageLeft,
  MessageRight,
  FileMessageLeft,
  FileMessageRight,
} from "./Message";
import Emojis from "./PopUps/Emojis";

export interface IoldMsgs {
  msg: string;
  msgBy: string;
  timeStamp: Date;
  isFile: boolean;
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
  // const [selectedFile, setSelectedFile] = useState<File>();

  const messageHistory = useSelector(
    (state: RootState) => state.chatHistory.messages
  );
  const showEmotePicker = useSelector(
    (state: RootState) => state.contextMenu.emojiBoxPopup
  );
  // const uploadstatus = useSelector(
  //   (state: RootState) => state.fileContext.uploadState.response
  // );
  const fileStatus = useSelector(
    (state: RootState) => state.fileContext.uploadState.response.message
  );
  const fileName = useSelector(
    (state: RootState) => state.fileContext.uploadState.response.fileName
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

    socket.on("--receive message--", ({ message, from, isFile }) => {
      console.log("---------receive message--------");
      console.log("from:", from);
      console.log("message:", message);
      console.log("isFile:", isFile);
      dispatch(
        appendMessage({
          msgBy: from!,
          isFile,
          msg: message,
          timeStamp: new Date(),
        })
      );

    });
  }, [dispatch, indexName]);

  // useEffect(() => {}, [uploadstatus]);

  useEffect(() => {
    if (messageHistory) {
      setOldMsgs(messageHistory);
      const lastMsg = document.querySelector("#messages > .message:last-child");
      console.log("lastmsg:", lastMsg);
      lastMsg?.scrollIntoView({ behavior: "instant", block: "end" });
    }
    // console.log("messageHistory", messageHistory);
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
        // setSelectedFile(file);
        const input = {
          file: file,
          message: msg,
          from: username!,
          toSend: indexName!,
          fileName: file.name,
        };
        console.log("file upload Input:", input);

        dispatch(fileUpload(input));
      }
    })!;
  }, [dispatch]);

  useEffect(() => {
    if (fileStatus === "File saved successfully" && fileName) {
      console.log("File saved successfully");
      console.log("fileStatusResponse.fileName:", fileName);
      sendMessage();
      dispatch(cleanUpFileState());
    }
  }, [fileStatus, fileName]);

  const sendMessage = () => {
    // e.preventDefault();
    console.log("triggered sendMEssage function");
    console.log("msg:", msg);
    dispatch(
      appendMessage({
        msgBy: username!,
        isFile: fileName !== "" ? true : false,
        msg: fileName !== "" ? fileName : msg,
        timeStamp: new Date(),
      })
    );
    const data = {
      message: msg === "" ? fileName : msg,
      from: username,
      toSend: indexName,
      isGroup,
      isFile: fileName === "" ? false : true,
    };
    console.log("data:", data);
    console.log("is socket active:", socket.active);

    socket.emit("chat message", data);
    console.log("chat message event emitted");
    setMsg("");
    // printSentMessage(fileName, msg);
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

    fileSelector.click();
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
              if (e.isFile) {
                // console.log("right is a file", e.isFile);

                return <FileMessageRight msg={e.msg} key={index} />;
              }
              return <MessageRight msg={e.msg} key={index} />;
            }

            if (e.isFile) {
              // console.log("left is a file", e.isFile);
              return <FileMessageLeft msg={e.msg} key={index} />;
            }

            return <MessageLeft msg={e.msg} key={index} />;
          })}
      </div>
      {showEmotePicker && <Emojis handleEmoteClick={handleEmoteClick} />}
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
