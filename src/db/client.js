import pg from "pg";
import { dbConfig } from "../config/index.js";

const pool = new pg.Pool(dbConfig);

export default pool;
