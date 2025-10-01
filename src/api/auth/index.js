import AuthHandler from "./handler.js";
import { authRoutes } from "./routes.js";
import { SignInPayloadSchema } from "./validator.js";

export const authPlugin = {
  name: "api-auth",
  version: "1.0.0",
  register: async (server) => {
    const authHandler = new AuthHandler();
    // let authRoutes = authRoutes(authHandler);
    // authRoutes = authRoutes.map((route) => {
    //   if (route.path === "/auth/sign-in") {
    //     route.options.validate = { payload: SignInPayloadSchema };
    //   }
    //   return route;
    // });
    server.route(authRoutes(authHandler));
  },
};
