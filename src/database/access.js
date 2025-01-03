import { DB_PASSWORD, DB_USER } from "../config.js";

const descriptografaXOR = (SQLUser, SQLPasswordCrypt) => {
  let num = SQLUser.charCodeAt(0); 

  for (let i = 1; i < SQLUser.length; i++) {
      num ^= SQLUser.charCodeAt(i); 
  }

  let password = '';

  for (let i = 0; i < SQLPasswordCrypt.length; i += 3) {
      
      const encryptedSegment = parseInt(SQLPasswordCrypt.substr(i, 3), 10);
      
      password += String.fromCharCode(num ^ encryptedSegment); 
  }

  return password; 
};

export const handleDecrypt = () => {
  const SQLUser = DB_USER; 
  const SQLPasswordCrypt = DB_PASSWORD; 
  return descriptografaXOR(SQLUser, SQLPasswordCrypt);
};