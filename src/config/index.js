import "dotenv/config";
import "@dotenvx/dotenvx/config";

export const HOST = process.env.HOST || "localhost";
export const PORT = process.env.PORT || 5000;

export const dbConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
};
