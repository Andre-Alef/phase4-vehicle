import { NextFunction } from "express";

export const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET!,
  baseURL: process.env.AUTH0_BASE_URL!,
  clientID: process.env.AUTH0_CLIENT_ID!,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
};

export function requireAuth(req: any, res: any, next: NextFunction) {
  if (!req.oidc?.isAuthenticated()) {
    return res.send("Auth failed");
  }
  next();
}
