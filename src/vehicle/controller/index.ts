import express, { Router } from "express";

import { VehicleFactory } from "../factory/vehicle.factory";
import { VehicleRepository } from "../repository/vehicle.repository";
import { VehicleService } from "../service/vehicle.service";
import { requireAuth } from "../../auth";

const vehicleRepository = new VehicleRepository();
const vehicleFactory = new VehicleFactory();
const vehicleService = new VehicleService(vehicleRepository, vehicleFactory);

const vehicleController = Router();

vehicleController.post("/", requireAuth, async (req: any, res) => {
  console.log({ ...req.body });
  const vehicle = await vehicleService.create({ ...req.body });
  console.log({ vehicle });
  res.send(
    JSON.stringify(
      {
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        price: vehicle.price,
        isAvailable: vehicle.isAvailable,
      },
      null,
      2
    )
  );
});

vehicleController.patch("/", requireAuth, async (req: any, res) => {
  const vehicle = await vehicleService.update({ ...req.body });
  res.send(
    JSON.stringify(
      {
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        price: vehicle.price,
        isAvailable: vehicle.isAvailable,
      },
      null,
      2
    )
  );
  //res.send(JSON.stringify(req.oidc.user, null, 2));
});

vehicleController.get("/:id", requireAuth, async (req: any, res) => {
  const vehicle = await vehicleService.get(req.params.id);
  res.send(
    JSON.stringify(
      {
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        price: vehicle.price,
        isAvailable: vehicle.isAvailable,
      },
      null,
      2
    )
  );
});

vehicleController.get("/", requireAuth, async (req: any, res) => {
  let isAvailable = req.query.isAvailable;
  if (isAvailable === "false") isAvailable = false;
  if (isAvailable === "true") isAvailable = true;
  console.log(
    req.query.isAvailable,
    JSON.stringify(req.oidc.user, null, 2),
    isAvailable
  );

  const vehicles = await vehicleService.list(isAvailable);
  res.send(
    JSON.stringify(
      vehicles.map((vehicle) => ({
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        price: vehicle.price,
        isAvailable: vehicle.isAvailable,
      })),
      null,
      2
    )
  );
});

export { vehicleController };
