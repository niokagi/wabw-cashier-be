import { SignInPayloadSchema, SignUpPayloadSchema } from "./validator.js";

export const authRoutes = (handler) => [
  {
    method: "POST",
    path: "/auth/sign-in",
    handler: handler.signInHandler,
    options: {
      auth: false,
      validate: {
        payload: SignInPayloadSchema,
      },
    },
  },
  {
    method: "POST",
    path: "/auth/sign-up",
    handler: handler.signUpHandler,
    options: {
      auth: false,
      validate: {
        payload: SignUpPayloadSchema,
      },
      description: "Register a new user",
      tags: ["api", "users"],
    },
  },
];
