export const areValidCredentials = (userID: string, password: string) => {
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
