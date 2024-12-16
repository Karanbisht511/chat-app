"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areValidCredentials = void 0;
const areValidCredentials = (userID, password) => {
    console.log(userID + " " + password);
    if (password.length < 8 || password.length > 20) {
        console.log("------password");
        return false;
    }
    if (userID.length < 8 || userID.length > 20) {
        console.log("------userID");
        return false;
    }
    return true;
};
exports.areValidCredentials = areValidCredentials;
