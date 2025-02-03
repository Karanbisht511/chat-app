import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../utils/utils";
import { fileDownload } from "../stateManagement/Messages/file";

interface Imsg {
  msg: string;
}

export const MessageRight: FC<Imsg> = ({ msg }) => {
  return (
    <div className="message right">
      <span
        className="text-content"
        style={{ borderRadius: "10px 10px 0px 10px" }}
      >
        {msg}
      </span>
    </div>
  );
};

export const MessageLeft: FC<Imsg> = ({ msg }) => {
  return (
    <div className="message left">
      <span
        className="text-content"
        style={{ borderRadius: "10px 10px 10px 0px" }}
      >
        {msg}
      </span>
    </div>
  );
};

export const FileMessageLeft: FC<Imsg> = ({ msg }) => {
  return (
    <div className="message left">
      <span
        className="text-content"
        style={{ borderRadius: "10px 10px 10px 0px" }}
      >
        <span>{msg}</span>
        <DownloadFile msg={msg} />
      </span>
    </div>
  );
};

export const FileMessageRight: FC<Imsg> = ({ msg }) => {
  return (
    <div className="message right">
      <span
        className="text-content"
        style={{ borderRadius: "10px 10px 0px 10px" }}
      >
        <span>{msg}</span>
        <DownloadFile msg={msg} />
      </span>
    </div>
  );
};

const DownloadFile: FC<Imsg> = ({ msg }) => {
  const dispatch = useAppDispatch();

  return (
    <span
      style={{ color: "white", margin: "5px" }}
      onClick={() => {
        const input = { filename: msg };
        dispatch(fileDownload(input));
      }}
    >
      <FontAwesomeIcon icon={faDownload} />
    </span>
  );
};
