import Lab from "@hapi/lab";
import { expect } from "@hapi/code";
import Sinon from "sinon";
import pool from "../../src/db/client.js";
import ClientError from "../../src/exceptions/ClientError.js";

export const lab = Lab.script();
const { describe, it, beforeEach, afterEach } = lab;

describe("auth-api", () => {
  beforeEach(() => {
    sandbox = Sinon.createSandbox();
    poolQueryStub = sandbox.stub(pool, "query");
  });

  afterEach(() => {
    sandbox.restore();
  });
});
