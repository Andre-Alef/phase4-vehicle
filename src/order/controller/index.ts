import { Router } from "express";
import { OrderFactory } from "../factory/order.factory";
import { OrderRepository } from "../repository/order.repository";
import { OrderService } from "../service/order.service";
import { VehicleRepository } from "../../vehicle/repository/vehicle.repository";
import { VehicleService } from "../../vehicle/service/vehicle.service";
import { VehicleFactory } from "../../vehicle/factory/vehicle.factory";

const vehicleFactory = new VehicleFactory();
const vehicleRepository = new VehicleRepository();
const vehicleService = new VehicleService(vehicleRepository, vehicleFactory);
const orderRepository = new OrderRepository();
const orderFactory = new OrderFactory();

const orderService = new OrderService(
  orderRepository,
  orderFactory,
  vehicleService
);

const orderController = Router();

orderController.post("/", async (req: any, res) => {
  const order = await orderService.create({
    ...req.body,
  });

  res.json({
    id: order.id,
    status: order.status,
    cpf: order.cpf,
    vehicleId: order.vehicleId,
    date: order.date,
  });
});

orderController.post("/finish", async (req: any, res) => {
  const order = await orderService.finishOrder({
    ...req.body,
  });

  res.json({
    id: order.id,
    status: order.status,
    cpf: order.cpf,
    vehicleId: order.vehicleId,
    date: order.date,
  });
});

orderController.patch("/", async (req: any, res) => {
  const order = await orderService.update({ ...req.body });
  res.json({
    id: order.id,
    status: order.status,
    cpf: order.cpf,
    vehicleId: order.vehicleId,
  });
});

orderController.get("/:id", async (req: any, res) => {
  const order = await orderService.get({ ...req.params.id });
  res.json({
    id: order.id,
    status: order.status,
    cpf: order.cpf,
    vehicleId: order.vehicleId,
    date: order.date,
  });
});

orderController.get("/", async (req: any, res) => {
  console.log(req.params.isAvailable);
  const orders = await orderService.list(req.params.isAvailable);

  res.json(
    orders.map((order) => ({
      id: order.id,
      status: order.status,
      cpf: order.cpf,
      vehicleId: order.vehicleId,
      date: order.date,
    }))
  );
});

export { orderController };
