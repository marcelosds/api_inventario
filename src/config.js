import { config } from "dotenv";

config();

//export const PORT = process.env.PORTA;
export const DB_USER = process.env.USER;
export const DB_PASSWORD = process.env.PASSWORD;
export const DB_SERVER = process.env.SERVER;
export const DB_DATABASE = process.env.DATABASE;
