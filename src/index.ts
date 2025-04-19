import express, { NextFunction } from "express";
import { config } from "dotenv";
import { auth } from "express-openid-connect";
import { vehicleController } from "./vehicle/controller";
import { orderController } from "./order/controller";
import { authConfig } from "./auth";

config();

const app = express();
app.use(express.json());
app.use(auth(authConfig));
app.use("/vehicles", vehicleController);
app.use("/orders", orderController);

// Rota pública
app.get("/", (req, res) => {
  res.send(`
    <h1>Home</h1>
    <a href="/login">Login</a>
    <a href="/profile">Perfil</a>
    <a href="/logout">Logout</a>
  `);
});

export function requireAuth(req: any, res: any, next: NextFunction) {
  if (!req.oidc?.isAuthenticated()) {
    return res.send("Auth failed");
  }
  next();
}

// Rota protegida
app.get("/profile", requireAuth, (req: any, res) => {
  res.send(JSON.stringify(req.oidc.user, null, 2));
});

app.listen(3000, () => {
  console.log("Servidor rodando");
});
