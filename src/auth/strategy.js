import HapiJwt from "@hapi/jwt";
import "dotenv/config";
import "@dotenvx/dotenvx/config";

export const configureJwtStrategy = async (server) => {
  await server.register(HapiJwt);

  server.auth.strategy("jwt_strategy", "jwt", {
    keys: process.env.JWT_SECRET,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      exp: true,
    },
    validate: (artifacts, request, h) => {
      const { payload } = artifacts.decoded;
      return {
        isValid: true,
        credentials: { user: payload, scope: payload.role },
      };
    },
  });

  server.auth.default("jwt_strategy");
};
