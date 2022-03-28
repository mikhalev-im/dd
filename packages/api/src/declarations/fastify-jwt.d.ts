import { HydratedDocument } from "mongoose";
import { User } from "../modules/users/schema";

declare module "fastify-jwt" {
  interface FastifyJWT {
    payload: { email: string };
    user: HydratedDocument<User>;
  }
}