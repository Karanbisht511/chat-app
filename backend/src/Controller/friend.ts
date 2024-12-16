import { Request, Response } from "express";
import { Friends, friends } from "../Model/friend";


export const addFriend = async (req: Request, res: Response) => {
    try {
        const { username } = req.query;
        const { frToAdd } = req.body;
        console.log('username:', username);
        console.log('frToAdd:', frToAdd);
        const userExist = await Friends.findOne({ username });
        if (userExist) {
            await Friends.findOneAndUpdate({ username: username }, { '$push': { 'friendList': frToAdd } })
        } else {
            const addFriend = new Friends({ username, friendList: [frToAdd] })
            addFriend.save();
        }
        res.status(200).json({
            message: `${frToAdd} is added to friend list`
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
}

export const deleteFriend = async (req: Request, res: Response) => {
    try {
        const { username } = req.query;
        const { frToAdd } = req.body;
        console.log('username:', username);
        console.log('frToAdd:', frToAdd);

        await Friends.findOneAndUpdate({ username: username }, { '$pull': { 'friendList': frToAdd } })

        res.status(200).json({
            message: `${frToAdd} is deleted from friend list`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
}

export const getFriend = async (req: Request, res: Response) => {
    try {
        const { username } = req.query;
        console.log('username:', username);
        const result: friends = await Friends.findOne({ username: username });
        if (result)
            res.status(200).json({
                friendList: result.friendList,
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
}
