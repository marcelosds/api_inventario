import app from "./app.js";
//import { PORT } from "./config.js";

const PORT = process.env.PORTA || 3001;

app.listen(PORT);

console.log("Servidor rodando na porta:", PORT);



