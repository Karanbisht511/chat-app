import { FriendDetail } from "../Controller/user";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);
// const readDirAsync = promisify(fs.readdirSync);

export const getFriendImages = async (
  friendList: string[]
): Promise<FriendDetail[]> => {
  const friendDetailsPromises = friendList.map(async (friend: string) => {
    const imagePath = getImagePath(friend);

    if (!imagePath) {
      return {
        name: friend,
        imagePath,
      };
    }

    try {
      const buffer = await readFileAsync(imagePath);
      const base64Image = buffer.toString("base64");

      return {
        name: friend,
        image: `data:image/jpeg;base64,${base64Image}`,
        imagePath,
      };
    } catch (err) {
      console.error(`Error reading file for ${friend}:`, err);
      return {
        name: friend,
        imagePath: null,
      };
    }
  });

  return Promise.all(friendDetailsPromises);
};

export const getImagePath = (imageName: string): string => {
  console.log("imageName:", imageName);

  const filePath1 = path.join(__dirname, `../../profilePics/`);
  // console.log("filePath1:", filePath1);
  const files = fs.readdirSync(filePath1);
  console.log("files:", files);
  const fileName = files.filter((file) => file.split(".")[0] === imageName)[0];
  const filePath2 = path.join(__dirname, `../../profilePics/${fileName}`);
  // console.log("filePath2:", filePath2);
  // Check if the file exists
  if (!fs.existsSync(filePath2)) {
    return null;
  }
  return filePath2;
};

export const fetchImage = async (imageName: string): Promise<string> => {
  // console.log("imageName:", imageName);

  const imagePath = getImagePath(imageName);
  // console.log("imagePath:", imagePath);
  try {
    const buffer = await readFileAsync(imagePath);
    const base64Image = buffer.toString("base64");

    return `data:image/jpeg;base64,${base64Image}`;
  } catch (err) {
    console.error(`Error reading file for ${imageName}:`, err);
    return null;
  }
};
