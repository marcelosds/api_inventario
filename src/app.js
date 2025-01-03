import express from "express";
import cors from "cors";
import morgan from "morgan";
import inventarioRoutes from "./routes/inventario.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerFile from './swagger.json' with { type: 'json' };

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.use("/inventario", inventarioRoutes);
app.use("/inventario/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

export default app;
