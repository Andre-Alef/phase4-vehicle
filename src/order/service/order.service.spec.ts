import axios from "axios";
import { OrderService } from "./order.service";
import { OrderFactory } from "../factory/order.factory";
import { IOrderRepository } from "../repository/order.repository";
import { Order } from "../model/order.model";
import { Vehicle } from "../../vehicle/model/vehicle.model";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("OrderService", () => {
  let orderRepositoryMock: jest.Mocked<IOrderRepository>;
  let orderFactoryMock: jest.Mocked<OrderFactory>;
  let vehicleServiceMock: any;
  let orderService: OrderService;
  const URL = process.env.PHASE4_API_URL;

  beforeEach(() => {
    jest.resetAllMocks();
    orderRepositoryMock = {
      save: jest.fn(),
      get: jest.fn(),
      list: jest.fn(),
    };

    orderFactoryMock = {
      create: jest.fn(),
    } as any;

    vehicleServiceMock = {
      get: jest.fn(),
      update: jest.fn(),
    };

    orderService = new OrderService(
      orderRepositoryMock,
      orderFactoryMock,
      vehicleServiceMock
    );
  });

  describe("create", () => {
    it("creates an order when vehicle is available and updates vehicle availability", async () => {
      const orderInput = {
        vehicleId: "v1",
        cpf: "12345678900",
        date: new Date(),
      };
      const orderCreated = new Order({
        id: "o1",
        ...orderInput,
        status: "Placed",
      });
      const vehicle = new Vehicle({
        id: "v1",
        brand: "Toyota",
        model: "Corolla",
        year: 2020,
        color: "Blue",
        price: 20000,
        isAvailable: true,
      });

      orderFactoryMock.create.mockReturnValue(orderCreated);
      vehicleServiceMock.get.mockResolvedValue(vehicle);
      orderRepositoryMock.save.mockResolvedValue(orderCreated);
      vehicleServiceMock.update.mockResolvedValue(vehicle);
      mockedAxios.patch.mockResolvedValue({ data: "ok" });

      const result = await orderService.create(orderInput);

      expect(orderFactoryMock.create).toHaveBeenCalledWith({
        vehicleId: orderInput.vehicleId,
        cpf: orderInput.cpf,
        status: "Placed",
        date: orderInput.date,
      });
      expect(vehicleServiceMock.get).toHaveBeenCalledWith(
        orderCreated.vehicleId
      );
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(orderCreated);
      expect(vehicleServiceMock.update).toHaveBeenCalledWith({
        id: orderCreated.vehicleId,
        isAvailable: false,
      });
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${URL}/vehicles/availability`,
        { id: vehicle.id, isAvailable: false }
      );
      expect(result).toBe(orderCreated);
    });

    it("throws if vehicle is not available", async () => {
      const orderInput = {
        vehicleId: "v1",
        cpf: "12345678900",
        date: new Date(),
      };
      const orderCreated = new Order({
        id: "o1",
        ...orderInput,
        status: "Placed",
      });
      const vehicle = new Vehicle({
        id: "v1",
        brand: "Toyota",
        model: "Corolla",
        year: 2020,
        color: "Blue",
        price: 20000,
        isAvailable: false,
      });

      orderFactoryMock.create.mockReturnValue(orderCreated);
      vehicleServiceMock.get.mockResolvedValue(vehicle);

      await expect(orderService.create(orderInput)).rejects.toThrow(
        "Vehicle is not available"
      );

      expect(orderRepositoryMock.save).not.toHaveBeenCalled();
      expect(vehicleServiceMock.update).not.toHaveBeenCalled();
      expect(mockedAxios.patch).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("updates order status", async () => {
      const order = new Order({
        id: "o1",
        vehicleId: "v1",
        cpf: "12345678900",
        status: "Placed",
        date: new Date(),
      });
      const updatedOrder = new Order({
        vehicleId: order.vehicleId,
        cpf: order.cpf,
        status: "Success",
        date: order.date,
      });

      orderRepositoryMock.get.mockResolvedValue(order);
      orderRepositoryMock.save.mockResolvedValue(updatedOrder);

      const result = await orderService.update({ id: "o1", status: "Success" });

      expect(orderRepositoryMock.get).toHaveBeenCalledWith("o1");
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      expect(order.status).toBe("Success");
      expect(result).toBe(updatedOrder);
    });
  });

  describe("list", () => {
    it("lists orders filtered by availability", async () => {
      const orders = [
        new Order({
          id: "o1",
          vehicleId: "v1",
          cpf: "123",
          status: "Placed",
          date: new Date(),
        }),
      ];
      orderRepositoryMock.list.mockResolvedValue(orders);

      const result = await orderService.list(true);

      expect(orderRepositoryMock.list).toHaveBeenCalledWith(true);
      expect(result).toBe(orders);
    });
  });

  describe("get", () => {
    it("gets an order by id", async () => {
      const order = new Order({
        id: "o1",
        vehicleId: "v1",
        cpf: "123",
        status: "Placed",
        date: new Date(),
      });
      orderRepositoryMock.get.mockResolvedValue(order);

      const result = await orderService.get("o1");

      expect(orderRepositoryMock.get).toHaveBeenCalledWith("o1");
      expect(result).toBe(order);
    });
  });

  describe("finishOrder", () => {
    it("marks order success and keeps vehicle unavailable if payment success", async () => {
      const order = new Order({
        id: "o1",
        vehicleId: "v1",
        cpf: "123",
        status: "Placed",
        date: new Date(),
      });
      const vehicle = new Vehicle({
        id: "v1",
        brand: "Toyota",
        model: "Corolla",
        year: 2020,
        color: "Blue",
        price: 20000,
        isAvailable: false,
      });
      const updatedOrder = new Order({
        vehicleId: order.vehicleId,
        cpf: order.cpf,
        status: "Success",
        date: order.date,
      });

      orderRepositoryMock.get.mockResolvedValue(order);
      vehicleServiceMock.get.mockResolvedValue(vehicle);
      orderRepositoryMock.save.mockResolvedValue(updatedOrder);
      vehicleServiceMock.update.mockResolvedValue(vehicle);
      mockedAxios.patch.mockResolvedValue({ data: "ok" });

      const result = await orderService.finishOrder({
        id: "o1",
        paymentInfo: "success",
      });

      expect(orderRepositoryMock.get).toHaveBeenCalledWith("o1");
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      expect(order.status).toBe("Success");
      expect(vehicleServiceMock.update).not.toHaveBeenCalled();
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${URL}/vehicles/availability`,
        { id: vehicle.id, isAvailable: false }
      );
      expect(result).toBe(updatedOrder);
    });

    it("marks order failed and makes vehicle available if payment fails", async () => {
      const order = new Order({
        id: "o1",
        vehicleId: "v1",
        cpf: "123",
        status: "Placed",
        date: new Date(),
      });
      const vehicle = new Vehicle({
        id: "v1",
        brand: "Toyota",
        model: "Corolla",
        year: 2020,
        color: "Blue",
        price: 20000,
        isAvailable: false,
      });
      const updatedOrder = new Order({
        vehicleId: order.vehicleId,
        cpf: order.cpf,
        status: "Failed",
        date: order.date,
      });

      orderRepositoryMock.get.mockResolvedValue(order);
      vehicleServiceMock.get.mockResolvedValue(vehicle);
      orderRepositoryMock.save.mockResolvedValue(updatedOrder);
      vehicleServiceMock.update.mockResolvedValue(vehicle);
      mockedAxios.patch.mockResolvedValue({ data: "ok" });

      const result = await orderService.finishOrder({
        id: "o1",
        paymentInfo: "fail",
      });

      expect(orderRepositoryMock.get).toHaveBeenCalledWith("o1");
      expect(orderRepositoryMock.save).toHaveBeenCalledWith(order);
      expect(order.status).toBe("Failed");
      expect(vehicleServiceMock.update).toHaveBeenCalledWith({
        id: vehicle.id,
        isAvailable: true,
      });
      expect(mockedAxios.patch).toHaveBeenCalledWith(
        `${URL}/vehicles/availability`,
        { id: vehicle.id, isAvailable: true }
      );
      expect(result).toBe(updatedOrder);
    });
  });
});
