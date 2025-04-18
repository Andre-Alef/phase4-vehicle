import { expressjwt } from "express-jwt";
import jwksRsa from "jwks-rsa";

// Auth0 domain and audience (from your .env or hardcoded for now)
// export const checkJwt = expressjwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksUri: "https://dev-13vasesgnkdliwc5.us.auth0.com/.well-known/jwks.json",
//   }),
//   audience: "https://dev-13vasesgnkdliwc5.us.auth0.com/api/v2/",
//   issuer: "https://dev-13vasesgnkdliwc5.us.auth0.com/",
//   algorithms: ["RS256"],
// });

export const authConfig = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET!,
  baseURL: process.env.AUTH0_BASE_URL!,
  clientID: process.env.AUTH0_CLIENT_ID!,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
};
