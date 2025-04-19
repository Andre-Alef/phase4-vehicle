import express, { NextFunction } from "express";
import { config } from "dotenv";
import { auth } from "express-openid-connect";
import { vehicleController } from "./vehicle/controller";
import { orderController } from "./order/controller";
import { authConfig, requireAuth } from "./auth";

config();

const app = express();
app.use(express.json());
app.use(auth(authConfig));
app.use("/vehicles", vehicleController);
app.use("/orders", orderController);

app.get("/", (req, res) => {
  res.send(`
    <h1>Home</h1>
    <a href="/login">Login</a>
    <a href="/profile">Perfil</a>
    <a href="/logout">Logout</a>
  `);
});

app.get("/profile", requireAuth, (req: any, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

app.listen(3000, () => {
  console.log("Servidor rodando");
});
