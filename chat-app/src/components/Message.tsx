import { FC } from "react";

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
