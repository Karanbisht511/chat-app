import { useState, ChangeEvent, SyntheticEvent, FC } from "react";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faFaceSmile,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import { toggleEmotePopup } from "../stateManagement/PopupContexts/PopupContext";
import { useAppDispatch } from "../utils/utils";
import { socket } from "../socket";

interface Iprop {
  username: string;
  indexName: string;
  isGroup: boolean;
}

const TextBox: FC<Iprop> = ({ username, indexName, isGroup }) => {
  const dispatch = useAppDispatch();

  const [msg, setMsg] = useState<string>("");
  const [viewSendButton, setViewButton] = useState<boolean>(false);

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

  const handleAttachment = () => {
    console.log("handleAttachment");
    const fileSelector: HTMLInputElement =
      document.querySelector(".input-file")!;

    fileSelector.click();
    console.log("next to file detected");
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

  return (
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
  );
};

export default TextBox;
