import sql from "mssql";
import { DB_DATABASE, DB_SERVER, DB_USER } from "../config.js";
import { handleDecrypt } from "./access.js";


export const dbSettings = {
  user: DB_USER,
  password: handleDecrypt(),
  server: DB_SERVER,
  database: DB_DATABASE,
  options: {
    encrypt: true, 
    trustServerCertificate: true,
  },
};

export const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.error(error);
  }
};

export { sql };
