import Hapi from "@hapi/hapi";
import "dotenv/config";
import "@dotenvx/dotenvx/config";
import * as config from "./config/index.js";
// modules import
import { authPlugin } from "./api/auth/index.js";
import { configureJwtStrategy } from "./auth/strategy.js";
import { productsPlugin } from "./api/products/index.js";
import { usersPlugin } from "./api/users/index.js";

export const init = async () => {
  const server = Hapi.server({
    host: config.HOST,
    port: process.env.NODE_ENV === "test" ? 0 : config.PORT,
    routes: {
      cors: {
        origin: ["*"],
      },
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true,
        },
        xframe: "deny",
        xss: "enabled",
      },
    },
  });

  await configureJwtStrategy(server);
  await server.register([
    { plugin: authPlugin },
    { plugin: usersPlugin },
    { plugin: productsPlugin },
  ]);

  await server.start();
  console.log(`server running on ${server.info.uri}`);

  // for testing units
  return server;
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
