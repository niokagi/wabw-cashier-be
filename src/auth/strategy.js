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
      return {
        isValid: true,
        credentials: { user: artifacts.decoded.payload },
      };
    },
  });

  server.auth.default("jwt_strategy");
};
