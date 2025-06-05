// src/__mocks__/prisma.ts
import { PrismaClient } from "@prisma/client";
import { mockDeep } from "jest-mock-extended";

export const prismaMock = mockDeep<PrismaClient>();
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn(() => prismaMock),
}));
