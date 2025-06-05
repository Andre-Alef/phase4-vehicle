import express, { Router } from "express";

import { VehicleFactory } from "../factory/vehicle.factory";
import { VehicleRepository } from "../repository/vehicle.repository";
import { VehicleService } from "../service/vehicle.service";

const vehicleRepository = new VehicleRepository();
const vehicleFactory = new VehicleFactory();
const vehicleService = new VehicleService(vehicleRepository, vehicleFactory);

const vehicleController = Router();

vehicleController.post("/", async (req: any, res) => {
  console.log({ ...req.body });
  const vehicle = await vehicleService.create({ ...req.body });
  console.log({ vehicle });
  res.json({
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    price: vehicle.price,
    isAvailable: vehicle.isAvailable,
  });
});

vehicleController.patch("/", async (req: any, res) => {
  const vehicle = await vehicleService.update({ ...req.body });
  res.json({
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    price: vehicle.price,
    isAvailable: vehicle.isAvailable,
  });
  //res.send(JSON.stringify(req.oidc.user, null, 2));
});

vehicleController.get("/:id", async (req: any, res) => {
  const vehicle = await vehicleService.get(req.params.id);
  res.json({
    id: vehicle.id,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    color: vehicle.color,
    price: vehicle.price,
    isAvailable: vehicle.isAvailable,
  });
});

vehicleController.get("/", async (req: any, res) => {
  let isAvailable = req.query.isAvailable;
  if (isAvailable === "false") isAvailable = false;
  if (isAvailable === "true") isAvailable = true;
  console.log(
    req.query.isAvailable,

    isAvailable
  );

  const vehicles = await vehicleService.list(isAvailable);
  res.json(
    vehicles.map((vehicle) => ({
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      price: vehicle.price,
      isAvailable: vehicle.isAvailable,
    }))
  );
});

export { vehicleController };
