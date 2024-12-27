import { Messages } from "../Model/message"

export const saveMessageToDB = async (index: string, message: string) => {
    console.log('index,message ', index, message);
try {
    const indexExist =await Messages.find({ index });

    console.log("indexExist:", indexExist);

    if (indexExist.length===0 || JSON.stringify(index.length)==='[]') {
        console.log('--index dont exist');
        const saveNew = new Messages({
            index,
            messageArray: [{ "timeStamp": new Date(), "msgs": [message] }]
        })
        saveNew.save();
        return
    }

    console.log('----indexExist-----');

    await Messages.findOneAndUpdate({ index }, { '$push': { 'messageArray': { timeStamp: new Date(), msgs: message } } })
    return
   
} catch (error) {
    console.log('error:',error);
    
}

 
}