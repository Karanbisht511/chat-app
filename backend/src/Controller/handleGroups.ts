import { Request, Response } from "express";
import { Group, iGroups } from "../Model/groups";
import { User } from "../Model/user";

export const createGroup = async (req: Request, res: Response) => {
    try {
        const { admin, groupName, participants } = req.body;
        console.log(` groupName:${groupName}  admin:${admin} participants:${JSON.stringify(participants)}`);
        if (!admin || !groupName || !participants) {
            res.status(400).json({
                message: 'BadRequest',
            })
            return;
        }

        const groupExist = await Group.findOne({ groupName });
        if (groupExist) {
            res.status(404).json({
                message: 'group already exist. Try different name'
            })
            return;
        }
        const newGroup = new Group({ admin, groupName, groupParticipants: participants })
        newGroup.save();

        await User.findOneAndUpdate({ username: admin }, { '$push': { groups: groupName } })
        // associate group to all users
        participants.map(async (e: string) => {
            await User.findOneAndUpdate({ username: e }, { '$push': { groups: groupName } })
        })

        res.status(200).json({
            message: 'Group Created Successfully'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
}

export const deleteGroup = async (req: Request, res: Response) => {

    try {
        const { groupName } = req.body;
        if (!groupName) {
            res.status(400).json({
                message: 'BadRequest',
            })
            return;
        }

        console.log(`groupName:${groupName}`);
        const groupExist = await Group.findOne({ groupName });

        if (!groupExist) {
            res.status(404).json({
                message: 'Group Not Found'
            })
            return;
        }
        await Group.findOneAndDelete({ groupName });
        res.status(200).json({
            message: 'Group Deleted Successfully'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }

}

export const addParticipant = async (req: Request, res: Response) => {
    try {
        const { groupName, partyList } = req.body;
        if (!groupName || !partyList) {
            res.status(400).json({
                message: 'BadRequest',
            })
            return;
        }
        const groupExist = await Group.findOne({ groupName });

        if (!groupExist) {
            res.status(404).json({
                message: 'Group Not Found'
            })
            return;
        }

        await Group.findOneAndUpdate({ groupName }, { '$push': { groupParticipants: partyList } })
        res.status(200).json({
            message: 'Added Participants Successfully'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
}

export const removeParticipant = async (req: Request, res: Response) => {
    try {
        const { groupName, participant } = req.body;
        console.log('groupname: Participant:',groupName,participant);
        
        if (!groupName || !participant) {
            res.status(400).json({
                message: 'BadRequest',
            })
            return;
        }
        const groupExist = await Group.findOne({ groupName });

        if (!groupExist) {
            res.status(404).json({
                message: 'Group Not Found'
            })
            return;
        }

        await Group.findOneAndUpdate({ groupName }, { '$pull': { groupParticipants: participant } })
        await User.findOneAndUpdate({ username: participant }, { '$pull': { groups: groupName } })
        res.status(200).json({
            message: 'Removed Participants Successfully'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
}

export const groupParticipants = async (req: Request, res: Response) => {
    try {
        const { groupName } = req.query;
        if (!groupName) {
            res.status(400).json({
                message: 'BadRequest',
            })
            return;
        }
        const partyList = await (await Group.findOne({ groupName }).select('groupParticipants')).groupParticipants;
        console.log("partyList", JSON.stringify(partyList));

        res.status(200).json({
            partyList
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
}
