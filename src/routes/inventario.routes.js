import { Router } from "express"; // Importa o Router do Express
import {
  getBens,
  getBensSqlite,
  getBensById,
  getTotalBens,
  getInventario,
  getInventariosAtivos,
  getTotalInventariados,
  updateBensById,
  updateBase,
  getLocais,
  getLocaisGeral,
  getSituacao,
  getEstado,
  getCdinventario,
  getDispositivo
} from "../controllers/inventario.controller.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const secretKey = process.env.JWT_SECRET_KEY;

// Cria uma instância do Router do Express
const router = Router();

// Obter Token
router.post('/acesso', (req, res) => {
    const { email } = req.body; // Manipule conforme necessário
    const token = jwt.sign({ email }, secretKey, { expiresIn: '9999h' });

    res.json({ token });
});


// Middleware para verificar o token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send("Token não fornecido.");
  }

  try {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
    next(); // Chama o próximo middleware ou rota
    });
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    return res.status(401).send("Token inválido.");
  }
}; 

// Definição das rotas
router.get("/bens/:inventario", verifyToken, getBens);
router.get("/benssqlite/:inventario", verifyToken, getBensSqlite);
router.get("/inventario/:inventario", verifyToken, getInventario);
router.get("/total/:inventario", verifyToken, getTotalBens);
router.get("/inventariados/:inventario", verifyToken, getTotalInventariados);
router.get("/bens/:id/:inventario", verifyToken, getBensById);
router.put("/bens/:id/:inven", verifyToken, updateBensById);
router.put("/base/:inven", verifyToken, updateBase);
router.get("/locais/:ug", verifyToken, getLocais);
router.get("/locais/", verifyToken,getLocaisGeral);
router.get("/situacao/", verifyToken, getSituacao);
router.get("/estado/", verifyToken, getEstado);
router.get("/inventario/", verifyToken, getCdinventario);
router.get("/inventarios/", verifyToken, getInventariosAtivos);
router.get("/dispositivo/", verifyToken, getDispositivo);

// Exporta o router
export default router;
