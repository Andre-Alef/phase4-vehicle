import express from "express";
import { config } from "dotenv";
import { vehicleController } from "./vehicle/controller";
import { orderController } from "./order/controller";

config();

const app = express();
app.use(express.json());
app.use("/vehicles", vehicleController);
app.use("/orders", orderController);

app.listen(3001, () => {
  console.log("Servidor rodando");
});
