import EmojiPicker, { Theme, EmojiClickData } from "emoji-picker-react";
import { FC } from "react";

interface IProps {
  handleEmoteClick: (e: EmojiClickData) => void;
}

const Emojis: FC<IProps> = ({ handleEmoteClick }) => {
  return (
    <div className="emojis">
      <EmojiPicker
        height="100%"
        width="100%"
        theme={Theme.DARK}
        onEmojiClick={handleEmoteClick}
      />
    </div>
  );
};

export default Emojis;
