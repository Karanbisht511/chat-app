import { Messages } from "../Model/message";
import { IfileMetaData } from "../Model/message";

export const saveMessageToDB = async (
  index: string,
  message: string,
  sender: string,
  isFile: boolean = false,
  fileMetaData?: IfileMetaData
) => {
  console.log("index,message,sender ", index, message, sender);
  try {
    const indexExist = await Messages.find({ index });

    console.log("indexExist:", indexExist);
    console.log("metadata:", fileMetaData);

    if (indexExist.length === 0 || JSON.stringify(index.length) === "[]") {
      console.log("--index dont exist");
      const saveNew = new Messages({
        index,
        messageArray: [
          {
            timeStamp: new Date(),
            msg: message,
            msgBy: sender,
            isFile,
            fileMetaData,
          },
        ],
      });
      saveNew.save();
      return;
    }

    console.log("----indexExist-----");

    await Messages.findOneAndUpdate(
      { index },
      {
        $push: {
          messageArray: {
            timeStamp: new Date(),
            msg: message,
            msgBy: sender,
            isFile,
            fileMetaData,
          },
        },
      }
    );
    return;
  } catch (error) {
    console.log("error:", error);
  }
};
