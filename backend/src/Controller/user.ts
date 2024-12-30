import bcrypt from "bcryptjs";
import { Request, Response } from "express";
const { generateToken } = require("../Utils/JWTFunctions");
import { User } from "../Model/user";
import { Friends, friends } from "../Model/friend";
import { UserMsg } from '../Model/message'
import { Messages } from "../Model/message";
import { Message } from "../Model/message";


export const login = async (req: Request, res: Response) => {
  try {
    console.log("login");
    const { username, password } = req.body;
    console.log('username:', username);

    const result = await User.findOne({ username });

    if (!result) {
      res.status(400).json({ message: "Invalid User Credentials!" });
    } else if (result) {
      await User.findOneAndUpdate({ username }, { active: true })
      console.log(result);
      const { _id } = result;
      const userPayload = { userId: _id };
      const { passwordHash } = result;
      bcrypt.compare(password, passwordHash, function (err: any, isEqual: boolean) {
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
      });
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
    console.log('signup');

    const { username, password, email, mobile } = req.body;

    const saltRounds = 10;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Existing user");
      res.status(400).json({ message: "Email already in use" });
    } else {
      bcrypt.hash(password, saltRounds, function (err: any, passwordHash: string) {
        if (err) {
          console.log("error:" + err);
        }
        const newUser = new User({ username, passwordHash, email, mobile });
        newUser.save();
        res.status(200).send("Signup Successfull");
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(400).send("Some issue occured" + error.message);
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "logout successfully" });
  } catch (error: any) {
    res.status(400).json({ message: `${error.message}` });
  }
};

export const userDashboard = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    console.log('username:', username)
    const result: friends = await Friends.findOne({ username: username });
    const users = await User.find();
    let activeUser = await User.find({ active: true });

    res.status(200).json({
      friendList: result ? result.friendList : [],
      activeUser: activeUser ? activeUser.map((e: any) => e.username) : [],
      users: users ? users.map((e: any) => e.username) : []
    });
  } catch (error) {
    res.status(500).json({
      message: `${error}`
    })
  }
}

export const pushUnreadMsgs = async (req: Request, res: Response) => {

  try {
    const { username } = req.query;
    const unreadMsgs = await UserMsg.findOne({ username });
    if (unreadMsgs.nonDelMsg.length < 0) {
      res.status(404).json({
        devMessage: 'No-unread messages'
      })
    }
    res.status(200).json({
      messages: unreadMsgs.nonDelMsg
    })
  } catch (error) {
    res.status(500).json({
      message: `${error}`
    })
  }
}

export const placeUnreadMsgs = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    const { sender, msg } = req.body;
    const userExist = await UserMsg.findOne({ username });

    if (!userExist) {
      const newUser = new UserMsg({
        username, nonDelMsg: {
          sender, nonDeliveredMsg: [msg]
        }
      });
      newUser.save();
    }

    if (userExist) {
      if (userExist?.nonDelMsg.find((e: any) => e.sender === sender)) {
        console.log('found sender');

        const result = await UserMsg.findOneAndUpdate({ username, 'nonDelMsg.sender': sender }, { '$push': { 'nonDelMsg.$.nonDeliveredMsg': msg } })
        console.log('result:', JSON.stringify(result));

      } else {
        await UserMsg.findOneAndUpdate({ username }, { '$push': { 'nonDelMsg': { sender, nonDeliveredMsg: msg } } })
      }
    }

    res.status(200).json({
      messages: "message placed"
    })
  } catch (error) {
    res.status(500).json({
      message: `${error}`
    })
  }
}

export const getChats = async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    const { friend } = req.body;

    if (!username || !friend) {
      res.status(400).json({
        devMessage: 'Bad Request'
      });
      return;
    }

    const index1 = `${username}to${friend}`;
    const index2 = `${friend}to${username}`;

    const index1Msgs = await Messages.find({ index: index1 }).sort({ 'messageArray.timeStamp': 1 });
    const index2Msgs = await Messages.find({ index: index2 }).sort({ 'messageArray.timeStamp': 1 });

    console.log(`${index1}:`, JSON.stringify(index1Msgs, null, 2));
    console.log(`${index2}:`, JSON.stringify(index2Msgs, null, 2));

    let messagess: Array<Message> = [];

    // Process index1Msgs
    if (index1Msgs.length > 0 && index1Msgs[0].messageArray?.length > 0) {
      const msgByMe = index1Msgs[0].messageArray.map((e) => ({
        msg: e.msg,
        timeStamp: e.timeStamp,
        msgBy: 'me',
      }));
      messagess.push(...msgByMe);
    }

    // Process index2Msgs
    if (index2Msgs.length > 0 && index2Msgs[0].messageArray?.length > 0) {
      const msgByFr = index2Msgs[0].messageArray.map((e) => ({
        msg: e.msg,
        timeStamp: e.timeStamp,
        msgBy: friend,
      }));
      messagess.push(...msgByFr);
    }

    // Check if no messages were found
    if (
      (!index1Msgs.length || !index1Msgs[0]?.messageArray?.length) &&
      (!index2Msgs.length || !index2Msgs[0]?.messageArray?.length)
    ) {
      console.log('no data found');
      res.status(404).json({
        message: 'no messages found'
      });
      return;
    }

    // console.log('messages:',JSON.stringify(messagess));
    

    res.status(200).json({
      'messages': messagess.sort((a, b) => {
        const time1 = new Date(a.timeStamp).getTime();
        const time2 = new Date(b.timeStamp).getTime();
        return time1 - time2;
      })
    })
  } catch (error) {
    res.status(500).json({
      "message": 'internal server error'
    })
  }
}

export const getGroupChats = async (req: Request, res: Response) => {
  console.log('-----Group chat history-------');


  try {
    const { index } = req.query;
    if (!index) {
      res.status(400).json({
        devMessage: 'Bad Request'
      });
      return;
    }

    const indexMsgs = await Messages.find({ index }).sort({ 'messageArray.timeStamp': 1 });
    // console.log('msgs:', indexMsgs);

    // Check if no messages were found
    if (!indexMsgs.length || !indexMsgs[0]?.messageArray?.length) {
      console.log('no data found');
      res.status(404).json({
        message: 'no messages found'
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
      'messages': messagess
    })

  } catch (error) {
    res.status(500).json({
      "message": 'internal server error'
    })
  }
}
