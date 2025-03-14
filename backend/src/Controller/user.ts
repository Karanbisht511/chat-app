import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { generateToken, generateResetToken } from "../Utils/JWTFunctions";
import { User } from "../Model/user";
import { Friends, friends } from "../Model/friend";
import { UserMsg } from "../Model/message";
import { Messages } from "../Model/message";
import { Message } from "../Model/message";
import { send } from "../Utils/emailService";
import multer from "multer";
import fs from "fs";
import path from "path";
import mime from "mime";
import {
  getImagePath,
  getFriendImages,
  fetchImage,
} from "../Utils/readingImage";

// Define interfaces
interface UserDocument {
  username: string;
  groups: string[];
  active: boolean;
}

interface FriendDocument {
  username: string;
  friendList: string[];
}

interface groupDocument {
  groups: string[];
}

export interface FriendDetail {
  name: string;
  image?: string;
  imagePath: string | null;
}

interface DashboardResponse {
  friendList: FriendDetail[];
  activeUser: string[];
  users: string[];
  groups: FriendDetail[];
}

export const login = async (req: Request, res: Response) => {
  try {
    console.log("login");
    const { username, password } = req.body;
    console.log("username:", username);

    const result = await User.findOne({ username });

    if (!result) {
      res.status(400).json({ message: "Invalid User Credentials!" });
    } else if (result) {
      await User.findOneAndUpdate({ username }, { active: true });
      // console.log(result);
      const { _id } = result;
      const userPayload = { userId: _id };
      const { passwordHash } = result;
      bcrypt.compare(
        password,
        passwordHash,
        function (err: any, isEqual: boolean) {
          if (err) {
            console.log("error:" + err);
          }
          if (isEqual) {
            const token = generateToken(userPayload);
            // delete result["passwordHash"];
            res.status(200).json({
              success: true,
              isUserAuthenticated: true,
              username,
              token,
              userInfo: {
                username: result?.username,
                mobile: result?.mobile,
                email: result?.email,
              },
            });
          } else {
            res.status(400).json({
              success: true,
              isUserAuthenticated: false,
              message: "Invalid User Credentials!",
            });
          }
        }
      );
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      isUserAuthenticated: false,
      message: "Sorry unable to connect to system!",
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    console.log("signup");

    const { username, password, email, mobile } = req.body;

    const saltRounds = 10;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Existing user");
      res.status(400).json({ message: "Email already in use" });
    } else {
      bcrypt.hash(
        password,
        saltRounds,
        function (err: any, passwordHash: string) {
          if (err) {
            console.log("error:" + err);
          }
          const newUser = new User({
            username,
            passwordHash,
            email,
            mobile,
            groups: [],
          });
          newUser.save();
          res.status(200).send("Signup Successfull");
        }
      );
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send("Some issue occured" + error.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "logout successfully" });
  } catch (error: any) {
    res.status(400).json({ message: `${error.message}` });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body;
    //1-> check Validations
    if (!username || !email) {
      res.status(400).json({
        devMessage: "Bad Request",
      });
      return;
    }

    // 2->Check the user details in DB
    const userExist = await User.findOne({ username, email });
    console.log("userExist:", userExist);

    if (!userExist) {
      res.status(404).json({ message: "Not Found" });
    }

    //if details are fine
    // 3-> generate a time-bound token and return
    const { _id } = userExist;
    const token = generateResetToken({ _id });
    console.log("token:", token);
    //4->Send reset mail
    const clienturl = process.env.clientURL;
    await send(
      email,
      "reset Password",
      "Try reset your password",
      `<h1>reset your password using this link: ${clienturl}resetPassword/${token}</h1>`
    );
    res.status(200).send({ message: "Reset mail is sent" });
  } catch (error) {
    res.status(500).json({
      message: `internal server error: ${error}`,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log("username:password:", username, password);

    //1-> check Validations
    if (!username || !password) {
      res.status(400).json({
        devMessage: "Bad Request",
      });
      return;
    }

    const saltRounds = 10;

    bcrypt.hash(
      password,
      saltRounds,
      async function (err: any, passwordHash: string) {
        if (err) {
          console.log("error:" + err);
        }

        await User.findOneAndUpdate(
          { username },
          { passwordHash: passwordHash }
        );
        res.status(200).send({ message: "Password reset successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const userDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const username = req.query.username as string;
    if (!username) {
      res.status(400).json({ message: "Invalid username" });
      return;
    }

    // console.log("username:", username);

    const [result, groups, users, activeUser] = await Promise.all([
      Friends.findOne<FriendDocument>({ username }),
      User.findOne<groupDocument>({ username }).select("groups"),
      User.find<UserDocument>(),
      User.find<UserDocument>({ active: true }),
    ]);

    // if (!result) {
    //   res.status(404).json({ message: "User not found" });
    //   return;
    // }

    let friendDetails: FriendDetail[], groupDetails: FriendDetail[];
    if (result && result.friendList)
      friendDetails = await getFriendImages(result.friendList)!;
    if (groups && groups.groups)
      groupDetails = await getFriendImages(groups.groups)!;
    // console.log("groupDetails", groupDetails);
    const response = {
      friendList: friendDetails,
      activeUser: activeUser.map((user: UserDocument) => user.username),
      users: users
        .filter((user: UserDocument) => user.username !== username)
        .map((user: UserDocument) => user.username),
      groups: groupDetails ? groupDetails : [],
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error in userDashboard:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const pushUnreadMsgs = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    const unreadMsgs = await UserMsg.findOne({ username });
    if (unreadMsgs.nonDelMsg.length < 0) {
      res.status(404).json({
        devMessage: "No-unread messages",
      });
    }
    res.status(200).json({
      messages: unreadMsgs.nonDelMsg,
    });
  } catch (error) {
    res.status(500).json({
      message: `${error}`,
    });
  }
};

export const placeUnreadMsgs = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    const { sender, msg } = req.body;
    const userExist = await UserMsg.findOne({ username });

    if (!userExist) {
      const newUser = new UserMsg({
        username,
        nonDelMsg: {
          sender,
          nonDeliveredMsg: [msg],
        },
      });
      newUser.save();
    }

    if (userExist) {
      if (userExist?.nonDelMsg.find((e: any) => e.sender === sender)) {
        console.log("found sender");

        const result = await UserMsg.findOneAndUpdate(
          { username, "nonDelMsg.sender": sender },
          { $push: { "nonDelMsg.$.nonDeliveredMsg": msg } }
        );
        console.log("result:", JSON.stringify(result));
      } else {
        await UserMsg.findOneAndUpdate(
          { username },
          { $push: { nonDelMsg: { sender, nonDeliveredMsg: msg } } }
        );
      }
    }

    res.status(200).json({
      messages: "message placed",
    });
  } catch (error) {
    res.status(500).json({
      message: `${error}`,
    });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    const { friend } = req.body;
    console.log("username: ", username);

    if (!username || !friend) {
      res.status(400).json({
        devMessage: "Bad Request",
      });
      return;
    }

    const index1 = `${username}to${friend}`;
    const index2 = `${friend}to${username}`;

    const index1Msgs = await Messages.find({ index: index1 }).sort({
      "messageArray.timeStamp": 1,
    });
    const index2Msgs = await Messages.find({ index: index2 }).sort({
      "messageArray.timeStamp": 1,
    });

    // console.log(`${index1}:`, JSON.stringify(index1Msgs, null, 2));
    // console.log(`${index2}:`, JSON.stringify(index2Msgs, null, 2));

    let messagess: Array<Message> = [];

    // Process index1Msgs
    if (index1Msgs.length > 0 && index1Msgs[0].messageArray?.length > 0) {
      const msgByMe = index1Msgs[0].messageArray.map((e) => ({
        msg: e.msg,
        timeStamp: e.timeStamp,
        msgBy: username as string,
        isFile: e.isFile,
      }));
      messagess.push(...msgByMe);
    }

    // Process index2Msgs
    if (index2Msgs.length > 0 && index2Msgs[0].messageArray?.length > 0) {
      const msgByFr = index2Msgs[0].messageArray.map((e) => ({
        msg: e.msg,
        timeStamp: e.timeStamp,
        msgBy: friend,
        isFile: e.isFile,
      }));
      messagess.push(...msgByFr);
    }

    // Check if no messages were found
    if (
      (!index1Msgs.length || !index1Msgs[0]?.messageArray?.length) &&
      (!index2Msgs.length || !index2Msgs[0]?.messageArray?.length)
    ) {
      console.log("no data found");
      res.status(404).json({
        message: "no messages found",
      });
      return;
    }

    // console.log("messages:", JSON.stringify(messagess));

    res.status(200).json({
      messages: messagess.sort((a, b) => {
        const time1 = new Date(a.timeStamp).getTime();
        const time2 = new Date(b.timeStamp).getTime();
        return time1 - time2;
      }),
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const getGroupChats = async (req: Request, res: Response) => {
  console.log("-----Group chat history-------");

  try {
    const { index } = req.query;
    if (!index) {
      res.status(400).json({
        devMessage: "Bad Request",
      });
      return;
    }

    const indexMsgs = await Messages.find({ index }).sort({
      "messageArray.timeStamp": 1,
    });
    // console.log('msgs:', indexMsgs);

    // Check if no messages were found
    if (!indexMsgs.length || !indexMsgs[0]?.messageArray?.length) {
      console.log("no data found");
      res.status(404).json({
        message: "no messages found",
      });
      return;
    }

    let messagess: Array<Message> = [];

    // Process indexMsgs
    if (indexMsgs.length > 0 && indexMsgs[0].messageArray?.length > 0) {
      const msg = indexMsgs[0].messageArray.map((e) => ({
        msg: e.msg,
        timeStamp: e.timeStamp,
        msgBy: e.msgBy,
      }));
      messagess.push(...msg);
    }
    console.log("messagess:", JSON.stringify(messagess));

    res.status(200).json({
      messages: messagess,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

// Configure multer to save files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "profilePics/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log("req:", req.body);
    console.log("req.body.filename:", req.body.fileName);
    cb(null, `${file.originalname}`);
  },
});
export const profileDir = multer({ storage });

export const updateImage = async (req: Request, res: Response) => {
  try {
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    const { username, fileName } = req.body;

    if (!username) {
      res.status(400).json({ username: username });
      return;
    }

    if (!req.file) {
      res.status(400).send("No file uploaded.");
      return;
    }
    // Rename the file

    console.log("req.file.path:", req.file.path);
    const newPath = "profilePics/" + username;
    fs.renameSync(req.file.path, `${newPath}${path.extname(req.file.path)}`);
    await User.findOneAndUpdate({ username }, { profilePic: fileName });
    console.log("req.params.image:", req.params.image);
    const image = await fetchImage(username);
    // const image = await fetchImage(username+path.extname(req.file.path));
    console.log("filePath:", image);

    if (!image) {
      res.status(404).send("File not found");
      return;
    }
    res.send(image);
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const getImage = async (req: Request, res: Response) => {
  try {
    console.log("req.params.image:", req.params.image);
    const image = await fetchImage(req.params.image);
    // console.log("filePath:", image);
    // const filePath = getImagePath(req.params.image);
    if (!image) {
      res.status(404).send("File not found");
      return;
    }
    // // Set security headers
    // res.set({
    //   "Content-Security-Policy": "default-src 'self'",
    //   "X-Content-Type-Options": "nosniff",
    // });

    // Send the file
    res.send(image);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Error serving file" });
  }
};
